# fund-db-student-portal

[![Build Status](https://travis-ci.org/rubber-cat/fund-db-student-portal.svg?branch=master)](https://travis-ci.org/rubber-cat/fund-db-student-portal)

แอปพลิเคชันดูคะแนนเก็บวิชา Fundamental database systems (lab)

## ขั้นตอนการใช้งาน

1. ติดต่อ TA เพื่อแมปเมลนักศึกษากับรหัสนักศึกษา
2. กรอกฟอร์มที่หน้าแอปฯ ที่ `TBA` ระบบจะส่ง Token ไปทางอีเมล
3. เข้าดูคะแนนเก็บด้วย Token ที่ได้จากอีเมล

### Testing

John Doe's token

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4MDYxMFhYWCIsImZpcnN0bmFtZSI6IkpvaG4iLCJsYXN0bmFtZSI6IkRvZSIsImVtYWlsIjoiam9obmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTUwNDg1NTYyNn0.o6NPgvWldEY6Tr_JCjXyCKFB86ge-YjCMsCzl8hNf7Q
```

John Doe's record

```
{
    "firstname": "John",
    "id": "580610XXX",
    "lastname": "Doe",
    "scores": [
        {
            "fullMark": 50,
            "label": "lab 1",
            "type": "number",
            "value": 49
        },
        {
            "fullMark": 57,
            "label": "lab 2",
            "type": "number",
            "value": 56
        },
        {
            "fullMark": 55,
            "label": "lab 3",
            "type": "number",
            "value": 54
        }
    ]
}
```
