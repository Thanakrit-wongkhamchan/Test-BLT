# A brief overview of the project.

This lottery program is designed to allow users to freely purchase lottery tickets according to their preferences. Users can specify the exact numbers and positions they want or choose to randomize the numbers, regardless of the number of tickets they wish to buy. The system also allows specifying fixed digits for each position. After purchasing, the system will generate a random 6-digit winning number.

The purchased tickets are compared to the winning number based on the number of matching digits from the back. Additionally, users can test the prize distribution system by selecting the desired winning number.

After completing all steps, the system will distribute prize money based on the number of matching digits in the purchased tickets when they win.

โปรแกรมล็อตตอรี่นี้มีวัตถุประสงค์เพื่อให้ผู้ใช้สามารถซื้อล็อตตารี่ได้อย่างอิสระ โดยสามารถกำหนดเลขและตำแหน่งของตัวเลขที่ต้องการได้ด้วยตัวเอง หรือจะเลือกให้ระบบสุ่มเลขให้ก็ได้ ไม่ว่าผู้ใช้จะต้องการซื้อล็อตตารี่จำนวนกี่ใบก็ตาม

ผู้ใช้สามารถกำหนดตัวเลขเฉพาะในแต่ละตำแหน่งได้ และเมื่อทำการซื้อเสร็จ ระบบจะทำการสุ่มผลรางวัลขึ้นมาหนึ่งหมายเลขซึ่งมีทั้งหมด 6 หลัก

ล็อตตารี่ที่ซื้อจะถูกนำมาเปรียบเทียบกับหมายเลขรางวัล โดยใช้การเทียบตัวเลขจากด้านหลังของล็อตตารี่ หากผู้ใช้ต้องการทดสอบระบบการแจกรางวัล ก็สามารถเลือกหมายเลขที่ต้องการให้ถูกรางวัลได้

เมื่อทำทุกขั้นตอนเสร็จสิ้น ระบบจะทำการแจกจ่ายเงินรางวัลตามจำนวนหลักที่ตรงกับผลรางวัลของล็อตตารี่ที่ซื้อ


## Steps to set up and run the project.

1. Install dependencies

   ```bash
   pnpm install
   ```
3. Install @types/nodes

   ```bash
   pnpm add -D @types/node
   ```
   
2. Start the app

   ```bash
   pnpx ts-node app.ts
   ```

# Any assumptions made during development.

Input handling:
The way inputs are handled in this project differs from the traditional methods. When accepting data, functions need to be created to handle input from web forms, which differs from handling data in the terminal. In the terminal, Readline is used to manage input/output and ask questions to gather data. While both methods are similar, the web-based approach is significantly easier due to the availability of built-in forms for receiving data.

Data management:
Managing existing data involves decisions about data formats. For instance, if data is received as an integer but needs to be compared with the winning number, leading zeros in the numbers must be preserved. To handle this, the data may need to be converted to a string and padded with zeros using a function to match the required length. Similarly, if the winning number is declared as a 6-digit integer, and the number being compared has fewer digits, the system needs to truncate the number accordingly for a proper comparison.

Loop handling for repeated inputs:
When the system supports two methods for purchasing lottery tickets, users need to choose the method before proceeding. To implement this, the loop logic must be adjusted to separate the decision-making loop from the ticket input loop. Once a condition is met, the system exits the decision loop and focuses solely on collecting lottery ticket data in the inner loop.

เกี่ยวกับการรับ Input
การรับข้อมูลในระบบนี้แตกต่างจากวิธีการรับข้อมูลทั่วไป เช่น การรับข้อมูลในหน้าเว็บจำเป็นต้องสร้างฟังก์ชันเพื่อจัดการ input ที่มาจากฟอร์ม โดยฟังก์ชันเหล่านี้จะรองรับการเก็บข้อมูลจากผู้ใช้อย่างเหมาะสม

ขณะที่การรับข้อมูลผ่าน Terminal จะต้องใช้ Readline เพื่อจัดการ input และ output รวมถึงสร้างฟังก์ชันสำหรับถามคำถามเพื่อรับข้อมูล ซึ่งวิธีการทั้งสองมีลักษณะคล้ายกัน แต่การทำงานในเว็บง่ายกว่า เนื่องจากมีฟอร์มสำหรับรับข้อมูลที่ใช้งานสะดวกอยู่แล้ว

เกี่ยวกับการจัดการข้อมูลที่มีอยู่
เมื่อมีข้อมูลเข้ามา ระบบจะต้องจัดการข้อมูลเหล่านั้นให้เหมาะสม เช่น หากรับข้อมูลเป็นตัวเลข (int) แต่จำเป็นต้องเปรียบเทียบกับผลรางวัล ซึ่งตัวเลขด้านหน้าอาจมีค่าเป็น 0 จำเป็นต้องแปลงข้อมูลไปมา เช่น แปลงเป็น string แล้วใช้ฟังก์ชันเติม 0 เพื่อให้ครบจำนวนหลักสำหรับการเปรียบเทียบ

นอกจากนี้ หากผลรางวัลมีค่าเป็นตัวเลข 6 หลัก แต่จำนวนหลักที่ต้องเปรียบเทียบน้อยกว่า ก็ต้องตัดเลขให้มีจำนวนหลักที่เท่ากันก่อนที่จะทำการเปรียบเทียบ

เกี่ยวกับการใช้ Loop
ระบบต้องใช้ loop ในการรับค่าข้อมูลซ้ำ ๆ และด้วยเหตุที่ระบบรองรับสองวิธีในการซื้อล็อตตารี่ จำเป็นต้องให้ผู้ใช้เลือกวิธีการซื้อก่อน เมื่อใช้ loop จึงต้องออกแบบให้แยกลูปเพื่อปิดการทำงานเมื่อครบเงื่อนไข แล้วใช้ลูปภายในสำหรับการรับค่าล็อตตารี่เท่านั้น เพื่อให้ระบบสามารถดำเนินการได้อย่างถูกต้องและมีประสิทธิภาพ