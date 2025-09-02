# Skill-Sharing Community Platform

Welcome to the official repository for the Skill-Sharing Community Platform project. 
## Getting Started: Cloning the Code

To get a local copy of the project on your computer, please follow the folloing steps:

1.  **Copy the Repository URL**: Go to the main page of our GitHub repository. Click the green `< > Code` button and copy the HTTPS URL.
    
2.  **Open Your Terminal**: Open your command prompt, PowerShell, or any other terminal.
3.  **Clone the Project**: Navigate to the folder where you want to store the project and run the following command:
    ```sh
    git clone [paste-the-repository-url-here]
    ```
4.  **Navigate into the Project Folder**:
    ```sh
    cd Skill_Sharing_app
    ```
You now have the project on your computer and are ready to start working!


## How to Create a Branch

All work must be done on a separate feature branch to keep our `develop` branch stable. Never work directly on `main` or `develop`.
Complete the required work on your feature branch. Make small, frequent commits with clear and descriptive messages. Each commit should represent a single logical change. We follow this commit message format:

feat: A new feature

fix: A bug fix

docs: Changes to documentation (like this README)

style: Formatting changes, white-space, etc.

refactor: Code changes that neither fix a bug nor add a feature

1.  **Get the Latest Code**: Before starting a new task, make sure you have the most up-to-date version of our development branch:
    ```sh
    git checkout develop
    git pull
    ```
2.  **Create Your New Branch**: Create a new branch for your task. The branch name must match the name of your Trello card to ensure traceability.

    ```sh
    # Example for a new feature:
    git checkout -b feature/user-profile-page

    # Example for a bug fix:
    git checkout -b fix/login-button-bug
    ```

## Our 5-Step Development Workflow

To ensure code quality and clear communication, every task must follow this 5-step process, which links our Trello board directly to our Git history.

**Step 1: Create a Branch**
* Before writing any code, follow the instructions in the "How to Create a Branch" section above. Your branch name must match your Trello card.

**Step 2: Code and Commit Your Work**
* Complete the work for your task on your new branch.
* Make small, regular commits. Each commit should represent a single logical change.
* Write clear and descriptive commit messages (like "feat: add validation to registration form").

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
* Request a review from at least one other team member. They will review your code for quality and correctness.

**Step 5: Merge and Close**
* Once your PR has been approved by a teammate, merge it into the `develop` branch.
* After the merge is complete, move the Trello card from "In Progress" or "In Review" to the "Done" column.