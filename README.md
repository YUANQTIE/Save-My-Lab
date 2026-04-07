<h1 align="center">Save-My-Lab</h1>

<p align="center">
  <img src="https://github.com/user-attachments/assets/ee9796f8-81ae-46d4-8af2-bd1f398dbbab" alt="Save-My-Lab Logo" width="800" height="500"/>
</p>


<p align="center">This CCAPDEV project was made by Group 3 - Labron James, composing of Merry Ann Ong, Yuan Miguel Panlilio, and Nigel Henry So, and Princess Ayesa Tullao. We know how stressful it can be to find an available PC when deadlines are tight. By bringing a highly visual, interactive booking system to our labs, we ensure students always have a seat waiting for them, while giving technicians the tools they need to manage room capacities efficiently.</p>

---

<h1 align="center">INSTALLATION</h1>

<p align="center">1. Clone the Repository</p>

```bash
git clone https://github.com/YUANQTIE/Save-My-Lab.git
cd Save-My-Lab
```
<p align="center">2. Install Dependencies</p>

```bash
npm install bcrypt express mongoose hbs dotenv express-session connect-mongo
```
<p align="center">3. Configure Environment Variables</p>

```bash
MONGODB_URI="mongodb://[USERNAME]:[PASSWORD]@ac-7tknf2d-shard-00-00.cllro3o.mongodb.net:27017,ac-7tknf2d-shard-00-01.cllro3o.mongodb.net:27017,ac-7tknf2d-shard-00-02.cllro3o.mongodb.net:27017/Save-My-Lab?ssl=true&replicaSet=atlas-7l0y2d-shard-0&authSource=admin&appName=SaveMyLab"
```
<p align="center">4. Run the App</p>

```bash
node app.js
```

<p align="center">5. Open in Browser</p>

```bash
http://localhost:3000
```
