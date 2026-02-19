from pyteal import *

def p2p_session_contract():
    # Global state keys
    host = Bytes("host")
    quiz_winner = Bytes("quiz_winner")
    platform = Bytes("platform")
    total_pool = Bytes("total_pool")
    session_ended = Bytes("session_ended")

    # On creation: store host, platform address, initialize pool
    on_create = Seq([
        App.globalPut(host, Txn.application_args[0]),
        App.globalPut(platform, Txn.application_args[1]),
        App.globalPut(total_pool, Int(0)),
        App.globalPut(session_ended, Int(0)),
        App.globalPut(quiz_winner, Bytes("")),
        Approve()
    ])

    # Student stakes coins to join
    on_stake = Seq([
        Assert(Txn.type_enum() == TxnType.Payment),
        Assert(App.globalGet(session_ended) == Int(0)),
        App.globalPut(total_pool, App.globalGet(total_pool) + Txn.amount()),
        Approve()
    ])

    # Host ends session and sets quiz winner
    on_end_session = Seq([
        Assert(Txn.sender() == App.globalGet(host)),
        App.globalPut(session_ended, Int(1)),
        App.globalPut(quiz_winner, Txn.application_args[1]),
        Approve()
    ])

    # Distribute: 50% host, 40% winner, 10% platform
    on_distribute = Seq([
        Assert(App.globalGet(session_ended) == Int(1)),
        Assert(Txn.sender() == App.globalGet(host)),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: App.globalGet(host),
            TxnField.amount: App.globalGet(total_pool) * Int(50) / Int(100),
        }),
        InnerTxnBuilder.Submit(),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: App.globalGet(quiz_winner),
            TxnField.amount: App.globalGet(total_pool) * Int(40) / Int(100),
        }),
        InnerTxnBuilder.Submit(),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: App.globalGet(platform),
            TxnField.amount: App.globalGet(total_pool) * Int(10) / Int(100),
        }),
        InnerTxnBuilder.Submit(),
        Approve()
    ])

    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.application_args[0] == Bytes("stake"), on_stake],
        [Txn.application_args[0] == Bytes("end_session"), on_end_session],
        [Txn.application_args[0] == Bytes("distribute"), on_distribute],
    )

    return program

def clear_program():
    return Approve()

if __name__ == "__main__":
    with open("p2p_session_approval.teal", "w") as f:
        f.write(compileTeal(p2p_session_contract(), mode=Mode.Application, version=6))
    with open("p2p_session_clear.teal", "w") as f:
        f.write(compileTeal(clear_program(), mode=Mode.Application, version=6))
    print("✅ P2P contract compiled!")