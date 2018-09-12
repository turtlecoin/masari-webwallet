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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../lib/numbersLab/DestructableView", "../lib/numbersLab/VueAnnotate", "../lib/numbersLab/DependencyInjector", "../model/Wallet", "../model/AppState"], function (require, exports, DestructableView_1, VueAnnotate_1, DependencyInjector_1, Wallet_1, AppState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var wallet = DependencyInjector_1.DependencyInjectorInstance().getInstance(Wallet_1.Wallet.name, 'default', false);
    var ID_LOGIN = '0';
    var ID_SUBMIT = '1';
    var ID_GET_JOB = '2';
    var ID_KEEP_ALIVE = '3';
    AppState_1.AppState.enableLeftMenu();
    var Pool = /** @class */ (function () {
        function Pool(url, login, pass, algorithm, algorithmVariant) {
            this.poolLogin = '';
            this.poolPass = 'x';
            this.poolId = '';
            this.poolUrl = '';
            this.logged = false;
            this.pendingJob = true;
            this.algorithm = 'cn-lite';
            this.algorithmVariant = 1;
            this.intervalKeepAlive = 0;
            this.reconnectCount = 0;
            this.maxReconnectCount = 5;
            this.validShareCount = 0;
            this.invalidShareCount = 0;
            this.onNewJob = null;
            this.onClose = null;
            this.poolLogin = login;
            this.poolPass = pass;
            this.poolUrl = url;
            this.algorithm = algorithm;
            this.algorithmVariant = algorithmVariant;
            this.reconnectCount = 0;
            this.connect();
        }
        Pool.prototype.connect = function () {
            this.socket = new WebSocket(this.poolUrl);
            var self = this;
            this.socket.onopen = function () {
                console.log('Connected');
                self.authOnPool();
            };
            this.socket.onmessage = function (ev) {
                var data = ev.data;
                try {
                    var decoded = JSON.parse(data);
                    if (decoded !== null) {
                        var methodId = decoded.id;
                        var method = decoded.method;
                        if (methodId === ID_LOGIN || method == 'login') {
                            self.handlePoolLogin(decoded.id, decoded.method, decoded.result);
                        }
                        else if (methodId === ID_GET_JOB || method == 'job') {
                            self.handlePoolNewJob(decoded.id, decoded.method, decoded.params);
                        }
                        else if (methodId === ID_SUBMIT) {
                            self.handleSubmitResult(decoded.id, decoded.error, decoded.result);
                        }
                    }
                    else {
                        console.error('Received invalid message from the pool', data);
                    }
                }
                catch (error) {
                    console.log('POOL ERROR:', error, data.toString());
                }
                //client.destroy(); // kill client after server's response
            };
            this.socket.onclose = function () {
                ++self.reconnectCount;
                if (self.reconnectCount < self.maxReconnectCount) {
                    setTimeout(function () {
                        self.connect();
                    }, 10 * 1000);
                }
                else {
                    console.log('Connection closed');
                    self.logged = false;
                    if (self.intervalKeepAlive !== 0)
                        clearInterval(self.intervalKeepAlive);
                    if (self.onClose)
                        self.onClose();
                }
            };
            if (this.intervalKeepAlive !== 0)
                clearInterval(this.intervalKeepAlive);
            this.intervalKeepAlive = setInterval(function () {
                self.keepAlive();
            }, 30 * 1000);
        };
        Pool.prototype.stop = function () {
            clearInterval(this.intervalKeepAlive);
            this.socket.close();
        };
        Pool.prototype.logOn = function () {
            var self = this;
            if (this.logged)
                return Promise.resolve();
            return new Promise(function (resolve, reject) {
                while (!self.logged) { }
                resolve();
            });
        };
        Pool.prototype.handlePoolLogin = function (requestId, requestMethod, requestParams) {
            if (requestParams !== null) {
                this.logged = true;
                this.poolId = requestParams.id;
                if (requestParams.job !== null) {
                    requestParams.job.algo = 'cn-lite';
                    requestParams.job.variant = 1;
                    this.pendingJob = requestParams.job;
                    if (this.onNewJob)
                        this.onNewJob();
                }
            }
        };
        Pool.prototype.handlePoolNewJob = function (requestId, requestMethod, requestParams) {
            requestParams.algo = 'cn-lite';
            requestParams.variant = 1;
            this.pendingJob = requestParams;
            if (this.onNewJob)
                this.onNewJob();
        };
        Pool.prototype.handleSubmitResult = function (id, error, result) {
            if (error === null) {
                ++this.validShareCount;
            }
            else {
                ++this.invalidShareCount;
                console.log('INVALID SHARE');
            }
        };
        Pool.prototype.authOnPool = function () {
            this.socket.send(JSON.stringify({
                id: '0',
                method: 'login',
                params: {
                    login: this.poolLogin,
                    pass: this.poolPass
                },
            }) + '\n');
        };
        Pool.prototype.sendWorkerJob = function (share) {
            if (share.job_id !== this.pendingJob.job_id)
                return;
            var params = share;
            params.id = this.poolId;
            var rawData = JSON.stringify({
                id: ID_SUBMIT,
                method: 'submit',
                params: {
                    id: share.id,
                    job_id: share.job_id,
                    nonce: share.nonce,
                    result: share.result,
                },
            });
            this.socket.send(rawData);
        };
        Pool.prototype.askNewJob = function () {
            this.socket.send(JSON.stringify({
                id: ID_GET_JOB,
                method: 'getJob',
                params: {},
            }));
        };
        Pool.prototype.keepAlive = function () {
            this.socket.send(JSON.stringify({
                id: ID_KEEP_ALIVE,
                method: 'keepalived',
                params: {
                    id: this.poolId
                },
            }));
        };
        Pool.prototype.setJobResponse = function (job) {
            this.sendWorkerJob(job);
        };
        Object.defineProperty(Pool.prototype, "isLogged", {
            get: function () {
                return this.logged;
            },
            enumerable: true,
            configurable: true
        });
        return Pool;
    }());
    var MiningView = /** @class */ (function (_super) {
        __extends(MiningView, _super);
        function MiningView(container) {
            var _this = _super.call(this, container) || this;
            _this.workersThread = [];
            _this.pool = null;
            _this.hashCount = 0;
            _this.intervalRefreshHashrate = 0;
            return _this;
        }
        MiningView.prototype.destruct = function () {
            clearInterval(this.intervalRefreshHashrate);
            return _super.prototype.destruct.call(this);
        };
        __decorate([
            VueAnnotate_1.VueVar('')
        ], MiningView.prototype, "miningAddress", void 0);
        __decorate([
            VueAnnotate_1.VueVar(1)
        ], MiningView.prototype, "threads", void 0);
        __decorate([
            VueAnnotate_1.VueVar(5000)
        ], MiningView.prototype, "difficulty", void 0);
        __decorate([
            VueAnnotate_1.VueVar(0)
        ], MiningView.prototype, "throttleMiner", void 0);
        __decorate([
            VueAnnotate_1.VueVar(0)
        ], MiningView.prototype, "validShares", void 0);
        __decorate([
            VueAnnotate_1.VueVar(0)
        ], MiningView.prototype, "hashRate", void 0);
        __decorate([
            VueAnnotate_1.VueVar(0)
        ], MiningView.prototype, "maxHashRate", void 0);
        __decorate([
            VueAnnotate_1.VueVar(false)
        ], MiningView.prototype, "running", void 0);
        __decorate([
            VueAnnotate_1.VueVar([])
        ], MiningView.prototype, "miningAddressesAvailable", void 0);
        return MiningView;
    }(DestructableView_1.DestructableView));
    new MiningView('#app');
});
