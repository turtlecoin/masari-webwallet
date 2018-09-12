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

import {RawWallet, Wallet} from "./Wallet";
import {CoinUri} from "./CoinUri";
import {Storage} from "./Storage";
import { Mnemonic } from "../model/Mnemonic";

export class WalletRepository{

	static hasOneStored() : Promise<boolean>{
		return Storage.getItem('wallet', null).then(function (wallet : any) {
			return wallet !== null;
		});
	}
	
	static getWithPassword(rawWallet : RawWallet, password : string) : Wallet|null{
		if(password.length > 32)
			password = password.substr(0 , 32);
		if(password.length < 32){
			password = ('00000000000000000000000000000000'+password).slice(-32);
		}

		let privKey = new (<any>TextEncoder)("utf8").encode(password);
		let nonce = new (<any>TextEncoder)("utf8").encode(rawWallet.nonce);
		// rawWallet.encryptedKeys = this.b64DecodeUnicode(rawWallet.encryptedKeys);
		let encrypted = new Uint8Array(<any>rawWallet.encryptedKeys);
		let decrypted = nacl.secretbox.open(encrypted, nonce, privKey);
		if(decrypted === null)
			return null;
		rawWallet.encryptedKeys = new TextDecoder("utf8").decode(decrypted);
		return Wallet.loadFromRaw(rawWallet);
	}

	static getLocalWalletWithPassword(password : string) : Promise<Wallet|null>{
		return Storage.getItem('wallet', null).then((existingWallet : any) => {
			//console.log(existingWallet);
			if(existingWallet !== null){
				//console.log(JSON.parse(existingWallet));
				let wallet : Wallet|null = this.getWithPassword(JSON.parse(existingWallet), password);
				//console.log(wallet);
				return wallet;
			}else{
				return null;
			}
		});
	}
	
	static save(wallet : Wallet, password : string) : Promise<void>{
		let rawWallet = this.getEncrypted(wallet, password);
		return Storage.setItem('wallet', JSON.stringify(rawWallet));
	}

	static getEncrypted(wallet : Wallet, password : string){
		if(password.length > 32)
			password = password.substr(0 , 32);
		if(password.length < 32){
			password = ('00000000000000000000000000000000'+password).slice(-32);
		}

		let privKey = new (<any>TextEncoder)("utf8").encode(password);
		let rawNonce = nacl.util.encodeBase64(nacl.randomBytes(16));
		let nonce = new (<any>TextEncoder)("utf8").encode(rawNonce);
		let rawWallet = wallet.exportToRaw();
		let uint8EncryptedKeys = new (<any>TextEncoder)("utf8").encode(rawWallet.encryptedKeys);

		let encrypted : Uint8Array = nacl.secretbox(uint8EncryptedKeys, nonce, privKey);
		rawWallet.encryptedKeys = <any>encrypted.buffer;
		let tabEncrypted = [];
		for(let i = 0; i < encrypted.length; ++i){
			tabEncrypted.push(encrypted[i]);
		}
		rawWallet.encryptedKeys = <any>tabEncrypted;
		rawWallet.nonce = rawNonce;
		return rawWallet;
	}

	static deleteLocalCopy() : Promise<void>{
		return Storage.remove('wallet');
	}

    static dottedLine(doc: any, xFrom: number, yFrom: number, xTo: number, yTo: number, segmentLength: number) {
        // Calculate line length (c)
        var a = Math.abs(xTo - xFrom);
        var b = Math.abs(yTo - yFrom);
        var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

        // Make sure we have an odd number of line segments (drawn or blank) to fit it nicely
        var fractions = c / segmentLength;
        var adjustedSegmentLength = (Math.floor(fractions) % 2 === 0) ? (c / Math.ceil(fractions)) : (c / Math.floor(fractions));

        // Calculate x, y deltas per segment
        var deltaX = adjustedSegmentLength * (a / c);
        var deltaY = adjustedSegmentLength * (b / c);

        var curX = xFrom, curY = yFrom;
        while (curX <= xTo && curY <= yTo) {
            doc.line(curX, curY, curX + deltaX, curY + deltaY);
            curX += 2 * deltaX;
            curY += 2 * deltaY;
        }
    }

	static downloadEncryptedPdf(wallet : Wallet){
		if(wallet.keys.priv.spend === '')
			throw 'missing_spend';

		let coinWalletUri = CoinUri.encodeWalletKeys(
			wallet.getPublicAddress(),
			wallet.keys.priv.spend,
			wallet.keys.priv.view,
			wallet.creationHeight
		);

		let publicQrCode = kjua({
			render: 'canvas',
			text: wallet.getPublicAddress(),
			size:300,
		});

        let privateSpendQrCode = kjua({
            render: 'canvas',
            text: wallet.keys.priv.spend,
            size: 300,
        });

        let privateViewQrCode = kjua({
            render: 'canvas',
            text: wallet.keys.priv.view,
            size: 300,
        });

        
        let logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARkAAACACAYAAAA/Dh0oAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjcxQUM4RDBEQjVERDExRTg4MDA5OTZGNDFCMDVERTFDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjcxQUM4RDBFQjVERDExRTg4MDA5OTZGNDFCMDVERTFDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzFBQzhEMEJCNUREMTFFODgwMDk5NkY0MUIwNURFMUMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzFBQzhEMENCNUREMTFFODgwMDk5NkY0MUIwNURFMUMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7cb6xpAAA5dklEQVR42uxd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";

		let doc = new jsPDF('landscape');

        // background color
        doc.setFillColor(0, 132, 61);
        doc.rect(0, 0, 297, 210, "F");

        

        // middle line
        doc.setLineWidth(0.2);
        doc.setDrawColor(255, 255, 255);
        this.dottedLine(doc, 0, 105, 297, 105, 2);
        // column lines
        doc.setDrawColor(255, 255, 255);
        this.dottedLine(doc, 99, 0, 99, 210, 2);
        this.dottedLine(doc, 198, 0, 198, 210, 2);


        // BOX 1 [x = 5, y = 10]
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(0, 132, 61);
        doc.rect(5, 5, 90, 90, "F");
        doc.setFillColor(0, 132, 61);
        doc.rect(5, 75, 90, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(30);
        doc.text('Private View', 79, 79, null, 180);
        doc.addImage(privateViewQrCode, 'PNG', 25, 20, 50, 50);
        let qrViewText = wallet.keys.priv.view;
        let qrViewSplit = Math.ceil(qrViewText.length / 2);
        doc.setFontSize(8)
        doc.setTextColor(0, 0, 0)
        doc.text(qrViewText.slice(0, qrViewSplit), 74, 15, null, 180);
        doc.text(qrViewText.slice(qrViewSplit), 74, 11, null, 180);


        // BOX 2 - [x = 104, y = 10]
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(0, 132, 61);
        doc.rect(104, 5, 90, 90, "F");
        doc.setFillColor(0, 132, 61);
        doc.rect(104, 75, 90, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(30);
        doc.text('Private Spend', 182.5, 79, null, 180);
        doc.addImage(privateSpendQrCode, 'PNG', 124, 20, 50, 50);
        let qrSpendText = wallet.keys.priv.spend;
        let qrSpendSplit = Math.ceil(qrSpendText.length / 2);
        doc.setFontSize(8)
        doc.setTextColor(0, 0, 0)
        doc.text(qrSpendText.slice(0, qrSpendSplit), 174, 15, null, 180);
        doc.text(qrSpendText.slice(qrSpendSplit), 174, 11, null, 180);


        // BOX 3 - [x = 203, y = 10]
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(0, 132, 61);
        doc.rect(203, 5, 90, 90, "F");
        doc.setFillColor(0, 132, 61);
        doc.rect(203, 75, 90, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(30);
        doc.text('Mnemonic Seed', 286, 79, null, 180);
        //todo, add mnemonic text
        doc.setFontSize(12)
        let mnemon = Mnemonic.mn_encode(wallet.keys.priv.spend, "english");
        let mnemonicWords = mnemon !== null ? mnemon.split(' ') : [];
        doc.setTextColor(0, 0, 0);
        try {
            let lineOne = mnemonicWords.splice(0, 5);
            let lineTwo = mnemonicWords.splice(0, 5);
            let lineThree = mnemonicWords.splice(0, 5);
            let lineFour = mnemonicWords.splice(0, 5);
            let lineFive = mnemonicWords.splice(0, 5);
            let startPos = 291;
            let strLineOne = lineOne.join(' ');
            let startLineOne = startPos - parseInt(Math.floor((50 - strLineOne.length) / 2).toString());
            doc.text(strLineOne, startLineOne, 63, null, 180);
            let strLineTwo = lineTwo.join(' ');
            let startLineTwo = startPos - parseInt(Math.floor((50 - strLineTwo.length) / 2).toString());
            doc.text(strLineTwo, startLineTwo, 52, null, 180);
            let strLineThree = lineThree.join(' ');
            let startLineThree = startPos - parseInt(Math.floor((50 - strLineThree.length) / 2).toString());
            doc.text(strLineThree, startLineThree, 39, null, 180);
            let strLineFour = lineFour.join(' ');
            let startLineFour = startPos - parseInt(Math.floor((50 - strLineFour.length) / 2).toString());
            doc.text(strLineFour, startLineFour, 27, null, 180);
            let strLineFive = lineFive.join(' ');
            let startLineFive = startPos - parseInt(Math.floor((50 - strLineFive.length) / 2).toString());
            doc.text(strLineFive, startLineFive, 15, null, 180);
        }
        catch (e) {
            console.log("Couldn't get Mnemonic, ignoring!");
        }
        // BOX 4 - [x = 0, y = 100]
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(0, 132, 61);
        doc.rect(5, 115, 90, 90, "F");
        doc.setFillColor(0, 132, 61);
        doc.rect(5, 120, 90, 15, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(30);
        doc.text('Public Wallet', 20, 132, null, 0);
        doc.addImage(publicQrCode, 'PNG', 25, 140, 50, 50);
        let qrPublicText = wallet.getPublicAddress();
        let qrPublicSplit = Math.ceil(qrPublicText.length / 3);
        doc.setFontSize(8)
        doc.setTextColor(0, 0, 0)
        doc.text(qrPublicText.slice(0, qrPublicSplit), 23, 194, null, 0);
        doc.text(qrPublicText.slice(qrPublicSplit, qrPublicSplit * 2), 22, 198, null, 0);
        doc.text(qrPublicText.slice(qrPublicSplit * 2), 23, 202, null, 0);


        // BOX 5 - [x = 104, y = 110]
        doc.setFillColor(0, 132, 61);
        doc.roundedRect(104, 115, 89, 85, 2, 2, 'F');
        doc.setFontSize(10)
        doc.setTextColor(255, 255, 255)
        doc.text(108, 125, 'To deposit funds to this paper wallet, send the');
        doc.text(108, 130, 'TurtleCoin (TRTL) coins to the public address.');
        doc.text(108, 150, 'DO NOT REVEAL THE PRIVATE SPEND KEY.');
        doc.text(108, 165, 'Until you are ready to import the balance from this');
        doc.text(108, 170, 'wallet to your TurtleCoin wallet, a cryptocurrency');
        doc.text(108, 175, 'client, or exchange.');
        doc.text(108, 185, 'Amount:');
        doc.setDrawColor(255, 255, 255);
        doc.line(122, 185, 150, 185);
        doc.text(155, 185, 'Date:');
        doc.line(164, 185, 182, 185);
        doc.text(108, 190, 'Notes:');
        doc.line(119, 190, 182, 190);


        // BOX 6 - [x = 203, y = 110]
        doc.addImage(logo, 'PNG', 208, 135, 80, 36.44);


		try {
			doc.save('wallet_backup.pdf');
		} catch(e) {
			alert('Error ' + e);
		}

	}

}