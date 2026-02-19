from pyteal import *

def lecturer_session_contract():
    lecturer = Bytes("lecturer")
    platform = Bytes("platform")
    total_pool = Bytes("total_pool")
    session_ended = Bytes("session_ended")

    on_create = Seq([
        App.globalPut(lecturer, Txn.application_args[0]),
        App.globalPut(platform, Txn.application_args[1]),
        App.globalPut(total_pool, Int(0)),
        App.globalPut(session_ended, Int(0)),
        Approve()
    ])

    on_stake = Seq([
        Assert(App.globalGet(session_ended) == Int(0)),
        App.globalPut(total_pool, App.globalGet(total_pool) + Txn.amount()),
        Approve()
    ])

    on_distribute = Seq([
        Assert(Txn.sender() == App.globalGet(lecturer)),
        Assert(App.globalGet(session_ended) == Int(0)),
        App.globalPut(session_ended, Int(1)),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: App.globalGet(lecturer),
            TxnField.amount: App.globalGet(total_pool) * Int(80) / Int(100),
        }),
        InnerTxnBuilder.Submit(),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: App.globalGet(platform),
            TxnField.amount: App.globalGet(total_pool) * Int(20) / Int(100),
        }),
        InnerTxnBuilder.Submit(),
        Approve()
    ])

    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.application_args[0] == Bytes("stake"), on_stake],
        [Txn.application_args[0] == Bytes("distribute"), on_distribute],
    )

    return program

def clear_program():
    return Approve()

if __name__ == "__main__":
    with open("lecturer_approval.teal", "w") as f:
        f.write(compileTeal(lecturer_session_contract(), mode=Mode.Application, version=6))
    with open("lecturer_clear.teal", "w") as f:
        f.write(compileTeal(clear_program(), mode=Mode.Application, version=6))
    print("✅ Lecturer contract compiled!")