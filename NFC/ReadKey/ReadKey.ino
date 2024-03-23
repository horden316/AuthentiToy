#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN    5     // Reset腳
#define SS_PIN     53     // 晶片選擇腳

MFRC522 mfrc522(SS_PIN, RST_PIN);    // 建立MFRC522物件

MFRC522::MIFARE_Key key;  // 儲存金鑰

byte sector = 14;   // 指定讀寫的「區段」，可能值:0~15
byte sector2 = 15;   // 指定讀寫的「區段」，可能值:0~15

byte block = 1;     // 指定讀寫的「區塊」，可能值:0~3
byte block2 = 2;     // 指定讀寫的「區塊」，可能值:0~3



byte blockData0[16] = "ce88241ca3cb3791";   // 最多可存入16個字元
byte blockData1[16] = "5d0183ad233214d1";   // 最多可存入16個字元
byte blockData2[16] = "439c8126e5233aca";   // 最多可存入16個字元
byte blockData3[16] = "378ae9f45019949f";   // 最多可存入16個字元

// 暫存讀取區塊內容的陣列，MIFARE_Read()方法要求至少要18位元組空間，來存放16位元組。
byte buffer[18];

MFRC522::StatusCode status;

void readBlock(byte _sector, byte _block, byte _blockData[])  {
  if (_sector < 0 || _sector > 15 || _block < 0 || _block > 3) {
    // 顯示「區段或區塊碼錯誤」，然後結束函式。
    Serial.println(F("Wrong sector or block number."));
    return;
  }

  byte blockNum = _sector * 4 + _block;  // 計算區塊的實際編號（0~63）
  byte trailerBlock = _sector * 4 + 3;   // 控制區塊編號

  // 驗證金鑰
  status = (MFRC522::StatusCode) mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, trailerBlock, &key, &(mfrc522.uid));
  // 若未通過驗證…
  if (status != MFRC522::STATUS_OK) {
    // 顯示錯誤訊息
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  byte buffersize = 18;
  status = (MFRC522::StatusCode) mfrc522.MIFARE_Read(blockNum, _blockData, &buffersize);

  // 若讀取不成功…
  if (status != MFRC522::STATUS_OK) {
    // 顯示錯誤訊息
    Serial.print(F("MIFARE_read() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  // 顯示「讀取成功！」
  Serial.println(F("Data was read."));
}

void setup() {
  Serial.begin(9600);
  SPI.begin();               // 初始化SPI介面
  mfrc522.PCD_Init();        // 初始化MFRC522卡片

  Serial.println(F("Please scan MIFARE Classic card..."));

  // 準備金鑰（用於key A和key B），出廠預設為6組 0xFF。
  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }

}

void loop() {
  // 查看是否感應到卡片
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    return;  // 退回loop迴圈的開頭
  }

  // 選取一張卡片
  if ( ! mfrc522.PICC_ReadCardSerial()) {  // 若傳回1，代表已讀取到卡片的ID
    return;
  }

//////
  readBlock(sector, block, buffer);      // 區段編號、區塊編號、存放讀取資料的陣列

  Serial.print(F("block0:"));        // 顯示儲存讀取資料的陣列元素值
  for (byte i = 0 ; i < 16 ; i++) {
    Serial.write (buffer[i]);
  }
  Serial.println();

///////

//////
  readBlock(sector, block2, buffer);      // 區段編號、區塊編號、存放讀取資料的陣列

  Serial.print(F("block1:"));        // 顯示儲存讀取資料的陣列元素值
  for (byte i = 0 ; i < 16 ; i++) {
    Serial.write (buffer[i]);
  }
  Serial.println();

///////

//////
  readBlock(sector2, block, buffer);      // 區段編號、區塊編號、存放讀取資料的陣列

  Serial.print(F("block2:"));        // 顯示儲存讀取資料的陣列元素值
  for (byte i = 0 ; i < 16 ; i++) {
    Serial.write (buffer[i]);
  }
  Serial.println();

///////

//////
  readBlock(sector2, block2, buffer);      // 區段編號、區塊編號、存放讀取資料的陣列

  Serial.print(F("block3:"));        // 顯示儲存讀取資料的陣列元素值
  for (byte i = 0 ; i < 16 ; i++) {
    Serial.write (buffer[i]);
  }
  Serial.println();

///////


  // 令卡片進入停止狀態
  mfrc522.PICC_HaltA();
}

