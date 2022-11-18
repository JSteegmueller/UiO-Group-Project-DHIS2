# Group project: Commodity dispensing

## Group 3

Group members:

* Janik Steegmüller
* Naomi Schoppa
* Kevin Zhu
* Linda Granholm

## Setup

This project was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform).

### Available Scripts

In the project directory, you can run:

### `npx dhis-portal --target=https://data.research.dhis2.org/in5320/`

Portal from local-host to server (http://localhost:9999)
Login: 'admin' - 'district'

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
A deployable `.zip` file can be found in `build/bundle`!

See the section about [building](https://platform.dhis2.nu/#/scripts/build) for more information.

### `yarn deploy`

Deploys the built app in the `build` folder to a running DHIS2 instance.<br />
This command will prompt you to enter a server URL as well as the username and password of a DHIS2 user with the App
Management authority.<br/>
You must run `yarn build` before running `yarn deploy`.<br />

See the section about [deploying](https://platform.dhis2.nu/#/scripts/deploy) for more information.

### Learn More

You can learn more about the platform in the [DHIS2 Application Platform Documentation](https://platform.dhis2.nu/).

You can learn more about the runtime in the [DHIS2 Application Runtime Documentation](https://runtime.dhis2.nu/).

To learn React, check out the [React documentation](https://reactjs.org/).

## About the project

This project is the result of our work in the course ‘IN5320 - Development in platform ecosystems’ at UiO. We have
designed a web-based app for the DHIS2 platform using React, the DHIS2 app development platform, the DHIS2 UI library
and styleguide, and the UiO git for development and coordination.

## Functionality

Our app is designed to primarily support hospital store managers in registering the dispensing of commodities. We have
also implemented a dashboard, in addition to support for store management, requesting commodities from other health
facilities, and stock recounts. Following is a brief description of the functionality available for the users of our
app:

### Commodity dispensing

The user is able to register when a commodity is dispensed by selecting a commodity, and input the amount of packets to
dispense and who the commodity is dispensed to. The user is allowed to dispense one or several different commodities in
a single transaction by adding/removing commodities in a "shopping cart". The user will not be able to dispense any
amount of a commodity that would bring the current stock level of that commodity below zero. If such an action is
attempted, the user is provided the options to either dispense just the available amount of commodity, get redirected to
the 'Request commodity' page or cancel the action. When submitting a transaction, the user gets confirmation regarding
the status of the transaction. On success, relevant stock and consumption levels are updated, and the new transaction is
displayed in a table together with the previous successful transactions.

### Stock balance overview

The user is presented with a table displaying the consumption and end balance of each commodity. The user has the
ability to search for commodities to narrow down the contents of the table. The current date and the number of days
until the next shipment of commodities arrive are provided above the table. If the user finds the need for an urgent
transfer, there is a button attached to each commodity that will redirect the user to the 'Request commodity' page.

### Request commodity

The user is presented with a table displaying the amount of available stock of the commodity at nearby
organizations/facilities within the same health district. The user is able to sort the table by organization and by the
amount of available stock. To view similar information for another commodity, the user can select commodities from a
dropdown menu.

### Store management

The user is able to register when commodities are delivered to the hospital store. The user is allowed to register the
received amount for one or more commodities in a single transaction by adding/removing commodities in a "shopping cart".
When submitting, the user is prompted to confirm the transaction. If the user confirms, the respective amounts are added
to the end balance of the selected commodities. The user can then view information about the transaction in a table
which always displays the latest restocking transaction.

### Stock recounts

The user is able to register if the end balance of a commodity does not correspond with the physical stock in the
medical store. The user is allowed to register a corrected amount for one or more commodities in a single transaction by
adding/removing commodities in a "shopping cart". When submitting, the user is prompted to confirm the transaction. If
the user confirms, the respective end balances are updated for the selected commodities. The user can then view
information about the transaction in a table which always displays the latest recounting transaction.

### Dashboard

The dashboard gives an overview of all parts of our app. Different functionalities and relevant information to the user
are displayed through separate cards. The stock card displays all the commodities with stock below a certain threshold,
and the threshold can be manually modified at the top of the card. The clock and user cards display the time and user
information respectively. The history card displays the most recent dispensing transactions. The recount and restock
cards, apart from showing the most recent related transactions, also display information such as the number of days from
the previous recount, and number of days until the next restock. These cards can be toggled on and off through buttons
at the top of the page, and each card also contains a shortcut button that leads directly to the related page in the
app. Dashboard settings for each user, such as toggled cards and other values used in the dashboard, are stored in the
data storage and persist between sessions.

## Implementation

The app is using the DataStore for storing history of transactions, stock recounts and restock history. Also the
configuration for the dashboard, like what cards are toggled or the threshold for low amount of stock are saved there.
For the current balance and consumption, corresponding dataValues for each commodity are updated for the current period.
When transitioning to a new period (i.e a new month), the first time the database is accessed by any user, the balance
values of the previous month will be exported to the new period for all uninitialized values.

Regarding the transaction form, user input is stored inside the local storage. This way all user input is preserved,
even when unintentionally closing the app.

The request commodity page can only be accessed through shortcuts in specific pages (Dashboard, Dispensing and Stock).
Each shortcut is connected to a specific commodity, whose information will be directly displayed in the request
commodity page once open.

## Missing functionality and weaknesses

- The data fetched on the dashboard does not get passed to other components. So the app refetches relevant data every
  time
  the user clicks on a shortcut. We could have used, e. g., a react context for saving request data. But due to the
  limited time and complexity we decided against it.

- Requests from the API could have been made less redundant between the various components of the application by storing
  them locally at the beginning.

- For adding a new transaction to the history, the app is pulling all previous transactions from the dataStore,
  appending
  the new transaction and pushing it back. For small scale this solution is sufficient, but a better way would be to
  integrate the transaction history into the DHIS2 system with use of dataValueSets and dataValues instead of the
  dataStore.

- The recount and restock is missing a paging functionality for the history of recounts and restocks.

- For the restock and recount functionalities, edge cases such as uninitialized data in the storage have not been fully
  tested, due to the back-end servers being down during the last few days leading up to the deadline.


