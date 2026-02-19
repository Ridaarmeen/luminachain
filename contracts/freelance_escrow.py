from pyteal import *

def escrow_contract():
    client = Bytes("client")
    freelancer = Bytes("freelancer")
    platform = Bytes("platform")
    amount = Bytes("amount")
    released = Bytes("released")

    on_create = Seq([
        App.globalPut(client, Txn.application_args[0]),
        App.globalPut(freelancer, Txn.application_args[1]),
        App.globalPut(platform, Txn.application_args[2]),
        App.globalPut(amount, Btoi(Txn.application_args[3])),
        App.globalPut(released, Int(0)),
        Approve()
    ])

    # Client releases payment when satisfied
    on_release = Seq([
        Assert(Txn.sender() == App.globalGet(client)),
        Assert(App.globalGet(released) == Int(0)),
        App.globalPut(released, Int(1)),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: App.globalGet(freelancer),
            TxnField.amount: App.globalGet(amount) * Int(95) / Int(100),
        }),
        InnerTxnBuilder.Submit(),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: App.globalGet(platform),
            TxnField.amount: App.globalGet(amount) * Int(5) / Int(100),
        }),
        InnerTxnBuilder.Submit(),
        Approve()
    ])

    # Client can dispute / refund
    on_refund = Seq([
        Assert(Txn.sender() == App.globalGet(client)),
        Assert(App.globalGet(released) == Int(0)),
        App.globalPut(released, Int(1)),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: App.globalGet(client),
            TxnField.amount: App.globalGet(amount),
        }),
        InnerTxnBuilder.Submit(),
        Approve()
    ])

    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.application_args[0] == Bytes("release"), on_release],
        [Txn.application_args[0] == Bytes("refund"), on_refund],
    )

    return program

def clear_program():
    return Approve()

if __name__ == "__main__":
    with open("escrow_approval.teal", "w") as f:
        f.write(compileTeal(escrow_contract(), mode=Mode.Application, version=6))
    with open("escrow_clear.teal", "w") as f:
        f.write(compileTeal(clear_program(), mode=Mode.Application, version=6))
    print("✅ Escrow contract compiled!")