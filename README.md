# Adventus

Software solution platform helps [Leitner Reisen](https://www.leitner-reisen.de/busreisen/reisethema/) by providing the key findings into customer travel behavior and suggesting the future trend.

### Project Structure

Following the standard structure of modern web application, our project composes [server](./backend) and [client](./frontend), which are responsible for handling the application's business logic and visualizing the application data on the browser interface respectively.

### Techstack

- **Server**: Python, FastAPI, Pandas, StatsModels
- **Client**: TypeScript, React, Material UI, Leaflet

### How-to-run

##### Server

- Go to server directory `.backend`
- Make a folder named `data`
- Download the two datasets [journey_final.csv](https://drive.google.com/file/d/1wzgC1ihtMYnI_lOVWHvuT6L3nqYNYXAu/view?usp=sharing) and [number_of_participants_v1.csv](https://drive.google.com/file/d/1TGquUg79TNDJh-tcv5fEqGrR-7Tugusl/view?usp=sharing) and save it under the folder `data`
- Make sure [Python](https://www.python.org/) installed on your machine
- (Optional) Create your virtual environment by `python -m venv .venv` and source the Python interpreter from the created environment `.venv`
- Install the module dependencies by `pip install -r requirements.txt`
- Run the server `python main.py`

##### Client

- Go to client directory `.client`
- Make sure [Node](https://www.nodejs.org/) installed on your machine
- Install the package dependencies by `npm install -f`
- Run the client `npm run dev`

### Deployment
