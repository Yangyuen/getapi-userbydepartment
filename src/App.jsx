import React, { useEffect, useState } from 'react';

const App = () => {
  // ใช้ useState เพื่อเก็บข้อมูลผู้ใช้ที่แยกตาม Department
  const [usersByDepartment, setUsersByDepartment] = useState({});

  useEffect(() => {
    // สร้างฟังก์ชัน สำหรับดึงข้อมูลผู้ใช้จาก API และแยกตามแผนก
    const fetchUsersByDepartment = async () => {
      try {
        
        // ดึงข้อมูลผู้ใช้จาก API
        const response = await fetch('https://dummyjson.com/users');
        const data = await response.json();
        
        // ตรวจสอบว่าข้อมูลที่ได้รับมีรูปแบบที่ถูกต้องและมี property 'users'
        if (typeof data === 'object' && data.hasOwnProperty('users')) {
          const users = data.users;
          
          // ใช้ reduce เพื่อจัดกลุ่มผู้ใช้ตามแผนก
          const groupedByDepartment = users.reduce((acc, user) => {
            // ดึงค่า department จาก company ของ user
            const { department } = user.company;
            // ดึงค่า gender, age, hair, address, fristName, lastName } จาก user
            const { gender, age, hair, address, firstName, lastName } = user;

            // ถ้าแผนกนี้ยังไม่มีอยู่ใน accmulator ให้สร้างใหม่
            if (!acc[department]) {
              // กำหนดค่าเริ่มต้นให้กับแผนกนี้
              acc[department] = {
                male: 0,          // จำนวนผู้ชายในแผนก
                female: 0,        // จำนวนผู้หญิงในแผนก
                ageRange: '',     // ช่วงอายุของผู้ใช้ในแผนก
                hair: {},         // สีผมของผู้ใช้ในแผนก
                addressUser: {}   // ที่อยู่ของผู้ใช้ในแผนก โดยใช้ชื่อผู้ใช้เป็น key
              };
            }
            
            // ตรวจสอบ gender
            // ถ้าค่า gender เป็น male
            if (gender === 'male') {
              // ให้เพิ่มจำนวน male ในแผนก 1
              acc[department].male += 1;
              // ถ้าค่า gender เป็น female
            } else if (gender === 'female') {
              // ให้เพิ่มจำนวน female ในแผนก 1
              acc[department].female += 1;
            }
            
            //กำหนดช่วงอายุของผู้ใช้ในแต่ละแผนก โดยใช้ฟังก์ชัน determineAgeRange ซึ่งจะคำนวณอายุใหม่ตาม 'age' 
            acc[department].ageRange = determineAgeRange(acc[department].ageRange, age);
            
            // สร้างตัวแปร hairColor เพื่อเก็บค่าสี
            const hairColor = hair.color;

            // ถ้ายังไม่มีการนับจำนวนสีผมนี้ในแผนก setDefault=0
            if (!acc[department].hair[hairColor]) {
              acc[department].hair[hairColor] = 0;
            }
            // เพิ่มจำนวนผู้ใช้ ที่มีสีผมนี้ในแผนก +1
            acc[department].hair[hairColor] += 1;

            // สร้างตัวแปร nameKey สำหรับเก็บที่อยู่ผู้ใช้ โดยใช้ nameKey เป็น firstName+lastName
            const nameKey = `${firstName}${lastName}`;
            // บันทึกที่อยู่ของผู้ใช้ในแผนก โดยใช้ nameKey และรหัสไปรษณีย์เป็นค่า
            acc[department].addressUser[nameKey] = address.postalCode;

            // ส่งกลับไป acc ที่มีการอัพเดทข้อมูลแล้ว
            return acc;
          }, {});

          setUsersByDepartment(groupedByDepartment);
        } else {
          throw new Error('Data received from API does not contain users array');
        }
      } catch (error) {
        console.error('Error fetching or processing data:', error);
      }
    };

    fetchUsersByDepartment();
  }, []);

  // ฟังก์ชั่น determineAgeRang 
  const determineAgeRange = (currentRange, age) => {
    // ตรวจสอบว่าช่วงอายุปัจจุบันถูกกำหนดหรือยัง
    if (!currentRange) {
      // ถ้ายังไม่ได้กำหนด ให้ตรวจสอบอายุของผู้ใช้และคืนค่าช่วงอายุ ตามเงื่อนไข
      if (age < 20) return 'Below 20'; 
      if (age < 30) return '20-30';
      if (age < 40) return '30-40';
      return '40+';
    }
    // ถ้าช่วงอายุปัจจุบันถูกกำหนดแล้ว ให้คืนค่าช่วงอายุปัจจุบันเลย
    return currentRange;
  };

  return (
    <div>
      <h1>Users by Department</h1>
      <pre>{JSON.stringify(usersByDepartment, null, 2)}</pre>
    </div>
  );
};

export default App;
