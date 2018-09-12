type vi = {
    amount: number,
    k_image: string,
    key_offsets: number[],
    mixin: number
    outnumber: number,
    outhash: string,
    type: string
}

type vo = {
    globalIndex: number,
    amount: 0,
    key: string,
    type: string
}

type RawDaemonTransaction = {
    vout: vo[],
    vin: vi[],
    fee: number, //fee
    unlock_time: number, //unlockTime
    global_index_start?: number, //global_index_start
    height?: number, //height
    timestamp?: number, //timestamp
    hash?: string, //hash
    publicKey: string, //publicKey
    paymentId: string //paymentId
};

type RawDaemonBlock = any;