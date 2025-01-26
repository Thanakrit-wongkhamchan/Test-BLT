import { disconnect } from "process";
import readline from "readline";

type Ticket = {
  number: string;
  amount: number;
  discountAmount: number;
};

interface PurchaseData {
  buyDigit: number;  
  buyNumber: number;  
  buyAmount: number;  
  buyDiscountAmount: number;
  fixedDigit: { digit: number; number: number }[];
}

class LottoService {
  customerTicket: Ticket[];
  drawResult: string | null = null;
  
  constructor() {
    this.customerTicket = []; 
    this.drawResult = null; 
  }
  private isClosed = false;
  
  //รับข้อมูลจากผู้ใช้และสิ้นสุดการทำงาน
  private rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  private askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }
  closeInterface() {
    if (!this.isClosed) {
      this.rl.close();
      this.isClosed = true;
    }
  }
  
  
  // ฟังก์ชันสำหรับการซื้อตั๋ว Lotto
  async buyTicket() {
    function formatNumberWithComma(number: number): string {
      return number.toLocaleString('en-US');
    }
    try {
      let continueBuying = true;
      let isWelcomeShown = true;

      while (continueBuying) {
        if (isWelcomeShown) {
          console.log("ยินดีต้อนรับสู่บริการ Lotto");
          console.log("ต้องการซื้อด้วยตัวเองกด B (Buy)\nต้องการสุ่มเลขกด R (Random) \nวิธีใช้งานกด I (Info) บนแป้นพิมพ์ของคุณ");
          isWelcomeShown = false; 
        }

        const mode = await this.askQuestion("เลือกหัวข้อที่คุณต้องการ (B/R/I): ");

        // ถ้าเลือกโหมดสุ่มเลข Lotto
        if (mode.toUpperCase() === "R" || mode.toUpperCase() === "RANDOM") {
          console.log("คุณเลือกโหมดสุ่มเลข Lotto");

          while (continueBuying) {
            const buyDigit = await this.askQuestion("จำนวนหลักที่ต้องการซื้อ 1-6 (หลัก): ");
            if (isNaN(Number(buyDigit)) || Number(buyDigit) < 1 || Number(buyDigit) > 6 ) {
              console.log("กรุณาใส่หลักที่ถูกต้อง (1-6)");
              continue;
            }console.log(`จำนวนหลัก ${buyDigit} หลัก`);

            const buyNumber = await this.askQuestion("จำนวน Lotto ที่ต้องการซื้อ (ใบ): ");
            if (isNaN(Number(buyNumber)) || Number(buyNumber) <= 0) {
              console.log("กรุณาใส่จำนวน Lotto ที่ต้องการซื้อให้ถูกต้อง");
              continue;
            }console.log(`จำนวน Lotto ${buyNumber} ใบ`);

            const buyAmount = await this.askQuestion("จำนวนราคา Lotto ต่อใบ (บาท): ");
            if (isNaN(Number(buyAmount)) || Number(buyAmount) <= 0) {
              console.log("กรุณาใส่จำนวนเงินต่อใบให้ถูกต้อง");
              continue;
            }console.log(`Lotto ใบละ ${formatNumberWithComma(Number(buyAmount))} บาท ราคาทั้งหมด ${formatNumberWithComma(Number(buyNumber))} ใบ ${formatNumberWithComma(Number(buyAmount) * Number(buyNumber))} บาท`)

            let fixedDigit: { digit: number; number: number }[] = [];
            const chooseFixedDigit = await this.askQuestion("ต้องการกำหนดเลขในแต่ละหลักด้วยตัวเองหรือไม่ (Y/N): ");
            if (chooseFixedDigit.toUpperCase() === "Y" || chooseFixedDigit.toUpperCase() === "YES") {
              while (true) {
                const digit = await this.askQuestion(`หลักที่คุณต้องการกำหนดเอง (หลักที่ 1 ถึง ${buyDigit} จากเลขซ้ายสุด): `);
                if (isNaN(Number(digit)) || Number(digit) < 1 || Number(digit) > Number(buyDigit) || Number(digit) != Number(digit)) {
                  console.log("กรุณาใส่ตำแหน่งหลักที่ถูกต้อง");
                  continue;
                }

                const number = await this.askQuestion("กรุณาใส่เลขที่ต้องการกำหนดในตำแหน่งนี้: ");
                if (isNaN(Number(number)) || Number(number) < 0 || Number(number) > 9) {
                  console.log("กรุณาใส่เลข 0-9");
                  continue;
                }

                fixedDigit.push({
                  digit: Number(digit),
                  number: Number(number),
                });
                const moreFixed = await this.askQuestion("ต้องการกำหนดเลขเพิ่มหรือไม่ (Y/N): ");
                if (moreFixed.toUpperCase() === "N" || moreFixed.toUpperCase() === "NO") {
                  break;
                }
              }
            }

            // ตรวจสอบว่ามีการกำหนดเลขในแต่ละหลักหรือไม่
            if (fixedDigit.length > 0) {
              const uniqueFixedDigit: { digit: number; number: number }[] = [];
              fixedDigit.forEach((fixedDigit) => {
                const index = uniqueFixedDigit.findIndex((item) => item.digit === fixedDigit.digit);
                if (index !== -1) {
                  uniqueFixedDigit[index] = fixedDigit;
                } else {
                  uniqueFixedDigit.push(fixedDigit);
                }
              });
            
              console.log("ตำแหน่งหลักและเลขที่ได้กำหนดสำหรับออกผลรางวัลแบบสุ่ม (ยึดตามเลขล่าสุดที่ถูกกำหนดในแต่ละหลัก):");
              uniqueFixedDigit.forEach((fixedDigit) =>
                console.log(`ตำแหน่งหลักที่ ${fixedDigit.digit}: เลข ${fixedDigit.number}`)
              );
            
              fixedDigit = uniqueFixedDigit; 
            } else {
              console.log("สุ่มเลขทั้งหมด");
            }
            
            let buyDiscountAmount = "0";
            if(buyDigit.length >= 5) {
              buyDiscountAmount = (Number(buyAmount) - (Number(buyAmount) * 0.1)).toString();
            }
            
            const purchaseData = {
              buyDigit: Number(buyDigit),
              buyNumber: Number(buyNumber),
              buyAmount: Number(buyAmount),
              buyDiscountAmount: Number(buyDiscountAmount),
              fixedDigit, 
            };
            this.getRandomNumber(purchaseData);
            continueBuying = false;
          }

        // ถ้าเลือกโหมดซื้อเลข Lotto ด้วยตัวเอง
        } else if (mode.toUpperCase() === "B" || mode.toUpperCase() === "BUY") {
          console.log("คุณเลือกโหมดซื้อเลขด้วยตัวเอง");
          while (continueBuying) {
            const lottoNumber = await this.askQuestion("กรุณาใส่เลข Lotto ที่คุณต้องการตั้งแต่ 1-6 (หลัก): ");

            if (lottoNumber.length > 6 || lottoNumber.length < 1 || isNaN(Number(lottoNumber)) || Number(lottoNumber) < 0) {
              console.log("กรุณาใส่เลข Lotto เป็นตัวเลขไม่เกิน 6 หลัก");
              continue;
            }
            const amount = await this.askQuestion("กรุณาใส่จำนวนที่ต้องการซื้อ (บาท): ");
            if (isNaN(Number(amount)) || Number(amount) <= 0) {
              console.log("กรุณาใส่จำนวนเงินที่ถูกต้อง");
              continue;
            }

            let discountAmount = "0";
            if(lottoNumber.length >= 5) {
              discountAmount = (Number(amount) - (Number(amount) * 0.1)).toString();
            }

            this.getTicket(lottoNumber, amount, discountAmount);
            console.log(`Lotto ของคุณเลข ${lottoNumber} จำนวน ${formatNumberWithComma(Number(amount))} บาท`);

            while (true) {
              const confirm = await this.askQuestion("ต้องการซื้อต่อหรือไม่ (Y/N): ");
              if (confirm.toUpperCase() === "N") {
                continueBuying = false; 
                break; 
              } else if (confirm.toUpperCase() === "Y") {
                break; 
              } else {
                console.log("กรุณาเลือกตัวเลือกที่ถูกต้อง (Y/N)");
              }
            }
          }
        
        // ถ้าเลือกโหมด Info
        } else if (mode.toUpperCase() === "I" || mode.toUpperCase() === "INFO") {
          console.log(`ยินดีต้อนรับสู่โปรแกรม Lotto\n
            คำอธิบายวิธีใช้งานโปรแกรมโหมดในการซื้อมีทั้งหมดสองหมวด คือ\n
            1. Random โหมดสุ่มเลข Lotto โดยโปรแกรมจะสุ่มเลขให้คุณ โดยคุณต้องระบุจำนวนหลักที่ต้องการซื้อ, จำนวน Lotto ที่ต้องการซื้อ และจำนวนเงินที่ต้องการซื้อ อีกทั้งคุณสามารถเลือกหลักที่ต้องการให้เป็นเลขที่คุณอยากได้ ส่วนหลักที่เหลือสามารถสุ่มได้\n
            2. Buy โหมดซื้อเลข Lotto ที่ต้องการด้วยตนเอง โดยคุณต้องระบุเลข Lotto ที่ต้องการซื้อและจำนวนเงินที่ต้องการซื้อ\n`);
          
        }

        // ถ้าเลือกโหมดไม่ตรง
        else {
          console.log("กรุณาเลือกโหมดที่ถูกต้อง (B/R/I)");
        }
      }
      
      
      //สรุป input ทั้งหมด
      const hasDiscount = this.customerTicket.some(ticket => ticket.discountAmount > 0);

      if (hasDiscount) {
        console.log(`คุณได้รับส่วนลด 10% จากการซื้อ Lotto 5 หลักขึ้นไป`);
      }
      console.log("Lotto ทั้งหมดของคุณ:");
      this.customerTicket.forEach((ticket, index) => {
        if (ticket.discountAmount > 0) {
          console.log(`ใบที่ ${index + 1} เลข ${ticket.number} จำนวน ${formatNumberWithComma(ticket.discountAmount)} บาท (ส่วนลดแล้ว)`);
        } else {
          console.log(`ใบที่ ${index + 1} เลข ${ticket.number} จำนวน ${formatNumberWithComma(ticket.amount)} บาท`);
        }
      });
     
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
    }
  }

  // ฟังก์ชันรับเลข Lotto และจำนวนเงินที่ซื้อ
  getTicket(lottoNumber: string, amount: string, discountAmount: string = amount) {
    this.customerTicket.push({
      number: String(lottoNumber),
      amount: Number(amount),
      discountAmount: Number(discountAmount),
    });
  }
  
  // ฟังก์ชันเมื่อเลือกโหมดสุ่มเลข Lotto
  getRandomNumber(purchaseData: PurchaseData) {
    const { buyDigit, buyNumber, buyAmount, buyDiscountAmount, fixedDigit } = purchaseData;
    const tickets: { number: string; amount: number; discountAmount: number}[] = [];  
  
    while (tickets.length < buyNumber) {
      let randomNumber = "";
      for (let i = 1; i <= buyDigit; i++) {
        const fixed = fixedDigit.find((fixdigit) => fixdigit.digit === i);
        if (fixed) {
          randomNumber += fixed.number.toString();  
        } else {
          randomNumber += Math.floor(Math.random() * 10).toString();  
        } 
      }
      
      
      // ไว้ทำให้ครบ 6 หลักเวลาตัวหน้าเป็น 0
      randomNumber = randomNumber.padStart(buyDigit, "0");

      const checkRandomNumber = tickets.filter((ticket) => ticket.number === randomNumber)
      if (checkRandomNumber.length > 0) {
        continue;
      }
      
        
      
      tickets.push({
        number: randomNumber, 
        amount: buyAmount,
        discountAmount: buyDiscountAmount,
        
      });
    }
    this.customerTicket.push(...tickets);
  }

  // ฟังก์ชันสำหรับเซ็ตผลรางวัลหรือกำหนดผลรางวัลเอง
  async setDraw() {
    try {
      console.log(`เลือกวิธีประกาศผลรางวัล คุณต้องการสุ่มผลรางวัล R (RANDOM) หรือกำหนดผลรางวัลเอง C (CUSTOM)`);
      const choice = await this.askQuestion("(R/C): ");
      
      // ถ้าเลือก RANDOM สุ่มผลรางวัล
      if (choice.toUpperCase() === "R" || choice.toUpperCase() === "RANDOM") {
        this.drawResult = this.generateRandomNumber(6);
        console.log(`ผลรางวัลที่สุ่มได้คือ: ${this.drawResult}`);
      } 
      
      // ถ้าเลือก CUSTOM กำหนดผลรางวัลเอง
      else if (choice.toUpperCase() === "C"|| choice.toUpperCase() === "CUSTOM") {
        const customNumber = await this.askQuestion("กรุณาใส่ผลรางวัลที่กำหนดเอง 6 หลัก: ");
        if (customNumber.length === 6 && !isNaN(Number(customNumber))) {
          this.drawResult = customNumber;
        } 
        else{
          console.log("กรุณาใส่ผลรางวัลที่กำหนดเอง 6 หลักที่ถูกต้อง");
          await this.setDraw(); 
        }
      } 

      // ถ้าเลือกวิธีที่ไม่ถูกต้อง
      else {
        console.log("กรุณาเลือกตัวเลือกที่ถูกต้อง (R/C)");
        await this.setDraw(); 
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
    }
  }

  //ฟั่งชั่นสำหรับสุ่มเลข
  private generateRandomNumber(length: number): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }
  

  // ฟังก์ชันตรวจสอบว่าตั๋วของคุณถูกรางวัลหรือไม่
  checkWinTicket() {
    if (!this.drawResult) {
      console.log("กรุณาตั้งค่าผลรางวัลก่อนตรวจสอบ");
      return;
    }

    console.log(`เลขที่ออกเลขที่: ${this.drawResult}`);
    
    //ฟังก์ชันตรวจสอบว่าถูกรางวัลหรือไม่
    const winningTickets = this.customerTicket.filter((ticket) => {
      const ticketString = ticket.number.toString();
      const drawResultString = this.drawResult!;
      return drawResultString.endsWith(ticketString);
    });

    // ถ้าถูกรางวัล
    if (winningTickets.length > 0) {
      console.log("รายการ Lotto ที่ถูกรางวัล:");
      winningTickets.forEach((ticket, index) => {
        let prizeMultiplier = 0;
        const ticketString = ticket.number.toString();
        const drawResultString = this.drawResult!;
        const matchLength = Math.min(ticketString.length,drawResultString.length);
        switch (matchLength) {
          case 6:
            prizeMultiplier = 10**6;
            break;
          case 5:
            prizeMultiplier = 10**5;
            break;
          case 4:
            prizeMultiplier = 10**4;
            break;
          case 3:
            prizeMultiplier = 10**3;
            break;
          case 2:
            prizeMultiplier = 10**2;
            break;
          case 1:
            prizeMultiplier = 10;
          default:
            break;
        }
        const prize = ticket.amount * prizeMultiplier;
        function formatNumberWithComma(number: number): string {
          return number.toLocaleString('en-US');
        }
        this.customerTicket.forEach((ticket, index) => {
          let afterWinPrize = ticket.amount- ticket.discountAmount;
          console.log(`ใบที่ ${index + 1}: เลข ${ticket.number} จำนวนเงิน ${formatNumberWithComma(ticket.amount)} บาท รางวัล: ${formatNumberWithComma(prize)} บาท จำนวนเงินที่ต้องจ่ายเพิ่มหลังถูกรางวัล ${formatNumberWithComma(afterWinPrize)}` );
        });
      });
    } 
    
    // ถ้าไม่ถูกรางวัล
    else {
      console.log("Lotto ของคุณไม่ถูกรางวัล ลองใหม่ครั้งหน้า");
    }
  }
}

// ฟังก์ชันเริ่มต้นการทำงานโปรแกรม
async function main() {
  const lottoService = new LottoService();
  try {
    await lottoService.buyTicket();
    await lottoService.setDraw();
    lottoService.checkWinTicket();
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
  } finally {
    lottoService.closeInterface();
  }
}

main();


//ถ้าซื้อ 5 หลักขึ้นไป ลด 10 เปอเซ็นต์ แต่ถ้าถูกรางวัล กลับไปจ่ายเต็มจำนวน