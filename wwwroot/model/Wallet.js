/*
 * Copyright (c) 2018, Gnock
 * Copyright (c) 2018, The Masari Project
 * Copyright (c) 2018, The TurtleCoin Project
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./Transaction", "./KeysRepository", "../lib/numbersLab/Observable", "./CryptoUtils"], function (require, exports, Transaction_1, KeysRepository_1, Observable_1, CryptoUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WalletOptions = /** @class */ (function () {
        function WalletOptions() {
            this.checkMinerTx = false;
            this.readSpeed = 10;
        }
        WalletOptions.fromRaw = function (raw) {
            var options = new WalletOptions();
            if (typeof raw.checkMinerTx !== 'undefined')
                options.checkMinerTx = raw.checkMinerTx;
            if (typeof raw.readSpeed !== 'undefined')
                options.readSpeed = raw.readSpeed;
            return options;
        };
        WalletOptions.prototype.exportToJson = function () {
            var data = {
                readSpeed: this.readSpeed,
                checkMinerTx: this.checkMinerTx
            };
            return data;
        };
        return WalletOptions;
    }());
    exports.WalletOptions = WalletOptions;
    var Wallet = /** @class */ (function (_super) {
        __extends(Wallet, _super);
        function Wallet() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            // lastHeight : number = 114000;
            // lastHeight : number = 75900;
            // private _lastHeight : number = 50000;
            _this._lastHeight = 0;
            _this.transactions = [];
            _this.txsMem = [];
            _this.modified = true;
            _this.creationHeight = 0;
            _this._options = new WalletOptions();
            _this.keyImages = [];
            _this.txOutIndexes = [];
            return _this;
        }
        Wallet.prototype.exportToRaw = function (includeKeys) {
            if (includeKeys === void 0) { includeKeys = false; }
            var transactions = [];
            for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
                var transaction = _a[_i];
                transactions.push(transaction.export());
            }
            var data = {
                transactions: transactions,
                lastHeight: this._lastHeight,
                nonce: '',
                options: this._options
            };
            if (includeKeys) {
                data.keys = this.keys;
            }
            else {
                if (this.keys.priv.spend !== '')
                    data.encryptedKeys = this.keys.priv.view + this.keys.priv.spend;
                else
                    data.encryptedKeys = this.keys.priv.view + this.keys.pub.view + this.keys.pub.spend;
            }
            if (this.creationHeight !== 0)
                data.creationHeight = this.creationHeight;
            return data;
        };
        Wallet.loadFromRaw = function (raw, includeKeys) {
            if (includeKeys === void 0) { includeKeys = false; }
            var wallet = new Wallet();
            wallet.transactions = [];
            for (var _i = 0, _a = raw.transactions; _i < _a.length; _i++) {
                var rawTransac = _a[_i];
                wallet.transactions.push(Transaction_1.Transaction.fromRaw(rawTransac));
            }
            wallet._lastHeight = raw.lastHeight;
            if (typeof raw.encryptedKeys === 'string') {
                if (raw.encryptedKeys.length === 128) {
                    var privView = raw.encryptedKeys.substr(0, 64);
                    var privSpend = raw.encryptedKeys.substr(64, 64);
                    wallet.keys = KeysRepository_1.KeysRepository.fromPriv(privSpend, privView);
                }
                else {
                    var privView = raw.encryptedKeys.substr(0, 64);
                    var pubViewKey = raw.encryptedKeys.substr(64, 64);
                    var pubSpendKey = raw.encryptedKeys.substr(128, 64);
                    wallet.keys = {
                        pub: {
                            view: pubViewKey,
                            spend: pubSpendKey
                        },
                        priv: {
                            view: privView,
                            spend: '',
                        }
                    };
                }
            }
            if (includeKeys && typeof raw.keys !== 'undefined') {
                wallet.keys = raw.keys;
            }
            if (typeof raw.creationHeight !== 'undefined')
                wallet.creationHeight = raw.creationHeight;
            if (typeof raw.options !== 'undefined')
                wallet._options = WalletOptions.fromRaw(raw.options);
            wallet.recalculateKeyImages();
            return wallet;
        };
        Wallet.prototype.isViewOnly = function () {
            return this.keys.priv.spend === '';
        };
        Object.defineProperty(Wallet.prototype, "lastHeight", {
            get: function () {
                return this._lastHeight;
            },
            set: function (value) {
                var modified = value !== this._lastHeight;
                this._lastHeight = value;
                if (modified)
                    this.notify();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Wallet.prototype, "options", {
            get: function () {
                return this._options;
            },
            set: function (value) {
                this._options = value;
                this.modified = true;
            },
            enumerable: true,
            configurable: true
        });
        Wallet.prototype.getAll = function (forceReload) {
            if (forceReload === void 0) { forceReload = false; }
            return this.transactions.slice();
        };
        Wallet.prototype.getAllOuts = function () {
            var alls = this.getAll();
            var outs = [];
            for (var _i = 0, alls_1 = alls; _i < alls_1.length; _i++) {
                var tr = alls_1[_i];
                outs.push.apply(outs, tr.outs);
            }
            return outs;
        };
        Wallet.prototype.addNew = function (transaction, replace) {
            if (replace === void 0) { replace = true; }
            var exist = this.findWithTxPubKey(transaction.txPubKey);
            if (!exist || replace) {
                if (!exist) {
                    this.transactions.push(transaction);
                }
                else
                    for (var tr = 0; tr < this.transactions.length; ++tr)
                        if (this.transactions[tr].txPubKey === transaction.txPubKey) {
                            this.transactions[tr] = transaction;
                        }
                // this.saveAll();
                this.recalculateKeyImages();
                this.modified = true;
                this.notify();
            }
        };
        Wallet.prototype.findWithTxPubKey = function (pubKey) {
            for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
                var tr = _a[_i];
                if (tr.txPubKey === pubKey)
                    return tr;
            }
            return null;
        };
        Wallet.prototype.getTransactionKeyImages = function () {
            return this.keyImages;
        };
        Wallet.prototype.getTransactionOutIndexes = function () {
            return this.txOutIndexes;
        };
        Wallet.prototype.getOutWithGlobalIndex = function (index) {
            for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
                var tx = _a[_i];
                for (var _b = 0, _c = tx.outs; _b < _c.length; _b++) {
                    var out = _c[_b];
                    if (out.globalIndex === index)
                        return out;
                }
            }
            return null;
        };
        Wallet.prototype.getCorrespondingOut = function (index, hash) {
            //find a corresponding output by Tx hash and "number" (index in Tx)
            for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
                var tx = _a[_i];
                if (tx.hash === hash) {
                    for (var _b = 0, _c = tx.outs; _b < _c.length; _b++) {
                        var out = _c[_b];
                        if (out.outputIdx === index) {
                            return out;
                        }
                    }
                }
            }
            return null;
        };
        Wallet.prototype.recalculateKeyImages = function () {
            var keys = [];
            var indexes = [];
            for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
                var transaction = _a[_i];
                for (var _b = 0, _c = transaction.outs; _b < _c.length; _b++) {
                    var out = _c[_b];
                    if (out.keyImage !== null && out.keyImage !== '')
                        keys.push(out.keyImage);
                    if (out.globalIndex !== 0)
                        indexes.push(out.globalIndex);
                }
            }
            this.keyImages = keys;
            this.txOutIndexes = indexes;
        };
        Wallet.prototype.getTransactionsCopy = function () {
            var news = [];
            for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
                var transaction = _a[_i];
                news.push(Transaction_1.Transaction.fromRaw(transaction.export()));
            }
            return news;
        };
        Object.defineProperty(Wallet.prototype, "amount", {
            get: function () {
                return this.unlockedAmount(-1);
            },
            enumerable: true,
            configurable: true
        });
        Wallet.prototype.unlockedAmount = function (currentBlockHeight) {
            //TODO: fix the display of unlocked balances vs total
            if (currentBlockHeight === void 0) { currentBlockHeight = -1; }
            var amount = 0;
            for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
                var transaction = _a[_i];
                if (!transaction.isFullyChecked())
                    continue;
                if (transaction.isFusionTx()) {
                    //Handle what we do with fusion Tx's
                    //this needs to be something like:
                    //tx's that are still locked up in fusion should display as "locked" balance, 
                    //only if it's been "cleared", then we should see it in "unlocked" balance
                }
                // if(transaction.ins.length > 0){
                // 	amount -= transaction.fees;
                // }
                if (transaction.isConfirmed(currentBlockHeight) || currentBlockHeight === -1)
                    for (var _b = 0, _c = transaction.outs; _b < _c.length; _b++) {
                        var out = _c[_b];
                        amount += out.amount;
                    }
                for (var _d = 0, _e = transaction.ins; _d < _e.length; _d++) {
                    var nin = _e[_d];
                    amount -= nin.amount;
                }
            }
            for (var _f = 0, _g = this.txsMem; _f < _g.length; _f++) {
                var transaction = _g[_f];
                // console.log(transaction.paymentId);
                // for(let out of transaction.outs){
                // 	amount += out.amount;
                // }
                if (transaction.isConfirmed(currentBlockHeight) || currentBlockHeight === -1)
                    for (var _h = 0, _j = transaction.outs; _h < _j.length; _h++) {
                        var nout = _j[_h];
                        amount += nout.amount;
                        // console.log('+'+nout.amount);
                    }
                for (var _k = 0, _l = transaction.ins; _k < _l.length; _k++) {
                    var nin = _l[_k];
                    amount -= nin.amount;
                    // console.log('-'+nin.amount);
                }
            }
            return amount;
        };
        Wallet.prototype.hasBeenModified = function () {
            return this.modified;
        };
        Wallet.prototype.getPublicAddress = function () {
            return cnUtil.pubkeys_to_string(this.keys.pub.spend, this.keys.pub.view);
        };
        Wallet.prototype.recalculateIfNotViewOnly = function () {
            if (!this.isViewOnly()) {
                for (var _i = 0, _a = this.transactions; _i < _a.length; _i++) {
                    var tx = _a[_i];
                    var needDerivation = false;
                    for (var _b = 0, _c = tx.outs; _b < _c.length; _b++) {
                        var out = _c[_b];
                        if (out.keyImage === '') {
                            needDerivation = true;
                            break;
                        }
                    }
                    if (needDerivation) {
                        var derivation = '';
                        try {
                            derivation = cnUtil.generate_key_derivation(tx.txPubKey, this.keys.priv.view); //9.7ms
                        }
                        catch (e) {
                            continue;
                        }
                        for (var _d = 0, _e = tx.outs; _d < _e.length; _d++) {
                            var out = _e[_d];
                            if (out.keyImage === '') {
                                var m_key_image = CryptoUtils_1.CryptoUtils.generate_key_image_helper({
                                    view_secret_key: this.keys.priv.view,
                                    spend_secret_key: this.keys.priv.spend,
                                    public_spend_key: this.keys.pub.spend,
                                }, tx.txPubKey, out.outputIdx, derivation);
                                out.keyImage = m_key_image.key_image;
                                this.modified = true;
                            }
                        }
                    }
                }
                if (this.modified)
                    this.recalculateKeyImages();
                for (var iTx = 0; iTx < this.transactions.length; ++iTx) {
                    for (var iIn = 0; iIn < this.transactions[iTx].ins.length; ++iIn) {
                        var input = this.transactions[iTx].ins[iIn];
                        if (input.amount < 0) {
                            if (this.keyImages.indexOf(input.keyImage) != -1) {
                                // console.log('found in', vin);
                                var walletOuts = this.getAllOuts();
                                for (var _f = 0, walletOuts_1 = walletOuts; _f < walletOuts_1.length; _f++) {
                                    var ut = walletOuts_1[_f];
                                    if (ut.keyImage == input.keyImage) {
                                        this.transactions[iTx].ins[iIn].amount = ut.amount;
                                        this.transactions[iTx].ins[iIn].keyImage = ut.keyImage;
                                        this.modified = true;
                                        break;
                                    }
                                }
                            }
                            else {
                                this.transactions[iTx].ins.splice(iIn, 1);
                                --iIn;
                            }
                        }
                    }
                    if (this.transactions[iTx].outs.length === 0 && this.transactions[iTx].ins.length === 0) {
                        this.transactions.splice(iTx, 1);
                        --iTx;
                    }
                }
            }
        };
        return Wallet;
    }(Observable_1.Observable));
    exports.Wallet = Wallet;
});
