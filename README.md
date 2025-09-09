# Skill-Sharing Community Platform

Welcome to the official repository for the Skill-Sharing Community Platform project.

---

## Getting Started: Cloning the Code

To get a local copy of the project on your computer, please follow the following steps:

1. **Copy the Repository URL**  
   Go to the main page of our GitHub repository. Click the green `< > Code` button and copy the HTTPS URL.

2. **Open Your Terminal**  
   Open your command prompt, PowerShell, or any other terminal.

3. **Clone the Project**  
   Navigate to the folder where you want to store the project and run the following command:

   ```sh
   git clone [paste-the-repository-url-here]
``

4. **Navigate into the Project Folder**

   ```sh
   cd Skill_Sharing_app
   ```

You now have the project on your computer and are ready to start working!

---

# Running the Application Locally

To run the application, you will need two terminals running simultaneously: one for the **MongoDB database** and one for the **Node.js server**.



## 1. Start Your MongoDB Server
Open a new terminal window and run the following command to start the MongoDB database.  
You must leave this terminal running in the background.

```bash
mongod
```


## 2. Start the Node.js Server
Open a second terminal window, navigate to the project's root directory, and run the following command to start the application server with **nodemon**.

```bash
npm run 
```

## 3. Access the Application
Once both servers are running, open your web browser and go to:

```
http://localhost:3000
```

---
## Project Structure

This project follows the **Model-View-Controller (MVC)** model to keep the code organized.

* 📁 **models**: Contains all Mongoose schemas, which define the structure of our database documents.
* 📁 **views**: Contains all EJS (`.ejs`) template files, which are rendered to the user's browser.
* 📁 **controllers**: Contains the business logic of the application, handling requests and sending responses.
* 📁 **routes**: Defines the URL endpoints for the application and maps them to the appropriate controller functions.
* 📁 **public**: Contains all static assets, such as CSS stylesheets, client-side JavaScript, and images.
* 📁 **config**: For configuration files, like the database connection setup.

---

## Database Schema

Our application uses two primary collections in MongoDB:

### User Collection

This collection stores information about each registered member.

* `username`: (String, Required, Unique)
* `email`: (String, Required, Unique)
* `password`: (String, Required, Hashed)
* `credits`: (Number, Default: 1)

### Skill Collection

This collection stores information about each skill or service offered by a user.

* `title`: (String, Required)
* `description`: (String, Required)
* `category`: (String, Required)
* `user`: (ObjectID, Ref: 'User') — A reference to the user who owns the skill.
* `status`: (String, Enum: \['available', 'in\_progress', 'completed'])

---

## Key Dependencies

* **Express.js**: A fast and minimalist web framework for Node.js that we use to build our server and handle routing.
* **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js, which helps us manage relationships between data and provides schema validation.
* **Dotenv**: A zero-dependency module that loads environment variables from a `.env` file, allowing us to keep secrets out of our code.

---

## How to Create a Branch

All work must be done on a separate feature branch to keep our `develop` branch stable. Never work directly on `main` or `develop`. Complete the required work on your feature branch. Make small, frequent commits with clear and descriptive messages. Each commit should represent a single logical change. We follow this commit message format:

* **feat:** A new feature
* **fix:** A bug fix
* **docs:** Changes to documentation (like this README)
* **style:** Formatting changes, white-space, etc.
* **refactor:** Code changes that neither fix a bug nor add a feature

```sh
# Example for a new feature:
git checkout -b feature/user-profile-page

# Example for a bug fix:
git commit -m "fix: resolve issue where login button was unresponsive"
```

---

# How to Work on a Branch

Follow these steps every time you start a new task.

---

## 1. Sync with the `develop` Branch

Before creating a new branch, always switch to the `develop` branch and pull the latest changes from GitHub.

```bash
git checkout develop
git pull
```

---

## 2. Create Your New Branch

Create a new branch for your task. Remember to name it after your Trello card (e.g., `feature/name-of-feature`).

```bash
# Example for a documentation update:
git checkout -b docs/update-readme
```

---

## 3. Make Your Code Changes & Commit

Now you write your code in this new branch. Once you made some changes and are ready to save your code, you need to **commit** them.

### Stage Your Files

First, add the files you've changed to the staging area. The `.` adds all modified files.

```bash
git add .
```

### Commit Your Changes

Next, save your staged changes with a clear message that follows our convention.

```bash
# Example for a new feature:
git commit -m "feat: implement user registration endpoint"

# Example for a documentation fix:
git commit -m "docs: clarify setup instructions"
```

---

After committing, you are ready to push your branch and create a **Pull Request (PR)**.

---

## Our 5-Step Development Workflow

To ensure code quality and clear communication, every task must follow this 5-step process, which links our Trello board directly to our Git history.

**Step 1: Create a Branch**

* Before writing any code, follow the instructions in the "How to Create a Branch" section above. Your branch name must match your Trello card.

**Step 2: Code and Commit Your Work**

* Complete the work for your task on your new branch.
* Make small, regular commits. Each commit should represent a single logical change.
* Write clear and descriptive commit messages (like `"feat: add validation to registration form"`).

**Step 3: Push and Create a Pull Request (PR)**

* Once your feature is complete and tested, push your branch to GitHub:

  ```sh
  git push origin feature/user-profile-page
  ```

* Go to our GitHub repository. You will see a prompt to create a Pull Request (PR) from your new branch.

* Create the PR, making sure the target is the `develop` branch. Write a clear title and description.

**Step 4: Link Your PR and Get it Reviewed**

* Copy the link to your new Pull Request.
* Paste the link into the comments section of the corresponding Trello card.
* Request a review from at least one other team member(See the troubleshooting section in this document to learn how.). They will review your code for quality and correctness.

**Step 5: Merge and Close**

* Once your PR has been approved by a teammate, merge it into the `develop` branch.
* After the merge is complete, move the Trello card from "Doing" to the "Done" column.

---

## Troubleshooting

### `git pull` Fails with "no tracking information"

* **Problem**: You run `git pull` on a branch and see an error like `There is no tracking information for the current branch.`
* **Reason**: This happens when your local branch doesn't know which branch to track on GitHub. It's a one-time setup for a new branch.
* **Solution**: Run the command that Git suggests. This command links your local branch to the remote one.

```sh
# Replace <branch-name> with the name of your current branch
git branch --set-upstream-to=origin/develop
```

After running this, you can use `git pull` as normal.

---

### Adding Reviewers to a Pull Request

There are two ways to request code reviews on GitHub.

---

#### **Method 1: When Creating the Pull Request (Best Time)**

This is the most common and efficient way to request a review.

1. **Locate the "Reviewers" Section**
   After you've pushed your branch and clicked **"Compare & pull request,"** you'll land on the form to open your PR.
   On the right-hand sidebar, you will see a section titled **"Reviewers"**.

2. **Click the Gear Icon** ⚙️
   Click the small gear icon next to the **"Reviewers"** title.

3. **Select Your Teammates**
   A dropdown will appear, listing all collaborators with access to the repository.

   * Click the name(s) of the teammate(s) you want to review your code.
   * Use the search box at the top if you have many collaborators.

4. **Confirmation**
   Once selected, their usernames will appear in the **"Reviewers"** section.
   When you click **"Create pull request,"** GitHub automatically notifies them (including via email).

---

#### **Method 2: After the Pull Request Has Been Created**

If you forget to add a reviewer at creation, you can add one later.

1. **Navigate to Your Pull Request**
   Go to the **"Pull requests"** tab in your repo and open the PR you want reviewed.

2. **Find the Sidebar**
   On the right-hand side, you’ll see the same sidebar from the PR creation page.

3. **Add a Reviewer**
   Click the gear icon ⚙️ in the **"Reviewers"** section, select teammates, and GitHub will notify them immediately.

---

### `mongod` Command Not Recognized
- **Problem:** You run `mongod` in the terminal and get a **"command not recognized"** error.  
- **Reason:** MongoDB is installed, but its location is not added to your system’s PATH variable.  
- **Solution:**  
  1. Locate your MongoDB **bin** directory (e.g., `C:\Program Files\MongoDB\Server\7.0\bin`).  
  2. Add it to your system’s **environment variables**.   


