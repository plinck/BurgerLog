# Creation Steps

1. Create Google Cloud Platform (GCP) Project

    * `gcloud projects create paullinck-burgerlog`

2. Enable AppEngine for the project

    * select location `us-central`
    * ![1](GCP/images/step1.png)
    * Wait ...
    * ![2](GCP/images/step2.png)
    * Start Configuring for Node.js
    * ![3](GCP/images/step3.png)
    * Pick node.js
    * ![4](GCP/images/step4.png)
    * Wait ...
    * ![5](GCP/images/step5.png)

3. Setup Database

    * ![1](GCP/images/db1.png)
    * ![2](GCP/images/db2.png)
    * ![4](GCP/images/db4.png)
    * ![5](GCP/images/db5.png)
    * ![6](GCP/images/db6.png)

4. Configure Connection in javascript code

    * configure `.env` file
    * configure `app.yaml` file
    * setup DB connection in code

```javascript
        // Google Cloud Platform Connection
        if (process.env.INSTANCE_CONNECTION_NAME) {
            config = {
                socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
                user: process.env.SQL_USER,
                password: process.env.SQL_PASSWORD,
                database: process.env.SQL_DATABASE
            };
        // Local DB Connection
        } else {
            config = {
                host: "localhost",
                port: 3306,
                user: "plinck",
                password: "password",
                database: "burger_db"
            };
        }
        this.connection = mysql.createConnection(config);
```
