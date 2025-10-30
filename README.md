# Wholesale Distributor Application

## Pages and APIs

### 1. Home Page (`/`)
- Landing page for the application.

### 2. Purchase Book (`/purchase`)
- Displays all purchases made between a selected time period where the supplier GST starts with a given string.

### 3. Sales Book (`/sales`)
- Displays all sales made between a selected time period where the buyer GST starts with a given string.

### 4. Purchase Details (`/purchase/bill/:id`)
- Returns details for a given bill number if it exists; otherwise, returns nothing.  
- Allows creation or updating of bill details based on the existence of the bill number.  
- Lists all driver licenses.  
- Lists all supplier GSTs.

### 5. Purchase Items (`/purchase/items/:id`)
- Lists all items available in the database (not limited to those in the bill).  
- Adds a new entry to purchased items for a given bill and increases the stock accordingly.  
- Returns the items associated with a given bill number.  
- Allows deletion of a purchased item from a bill.

### 6. Add Supplier (`/add/supplier`)
- Adds a new supplier.

### 7. Add Driver (`/add/driver`)
- Adds a new driver.

### 8. Add Item (`/add/item`)
- Adds a new item to the item list.

### 9. Loans Taken (`/loans/taken`)
- Lists all loans taken from suppliers.  
- Allows deletion of a loan record.

### 10. Loans Given (`/loans/given`)
- Lists all loans given to buyers.  
- Allows deletion of a loan record.

### 11. Take Loan (`/add/loanstaken`)
- Creates a new record for a loan taken.

### 12. Give Loan (`/add/loansgiven`)
- Creates a new record for a loan given.

### 13. Sales Details (`/sales/bill/:id`)
- Returns details for a given sales bill number if it exists; otherwise, returns nothing.  
- Allows creation or updating of bill details based on the existence of the bill number.  
- Lists all driver licenses.  
- Lists all buyer GSTs.

### 14. Sales Items (`/sales/items/:id`)
- Lists all items available in the database (not limited to those in the bill).  
- Adds a new entry to sold items for a given bill and decreases the stock accordingly.  
- Returns the items associated with a given bill number.  
- Allows deletion of a sold item from a bill.

### 15. Add Buyer (`/add/buyer`)
- Adds a new buyer.

### 16. Not Found
- Redirects users when they access an undefined route.

---

## Functional Details
The client procures goods in bulk from wholesalers in Varanasi and distributes them to local shopkeepers in Azamgarh. The range of goods includes dry fruits, cosmetics, ayurvedic products, chocolates, worship items, cooking oil, spices, and other grocery products.  

Suppliers provide goods to the client, which are transported to the warehouse. It is critical to verify that the quantity of goods received matches the supplied quantity; discrepancies are the driver’s responsibility. Therefore, the system maintains comprehensive driver data such as name, license number, phone number, address, and Aadhaar number.  

Similarly, the client distributes goods to buyers through transport vehicles, and the same verification and driver responsibility principles apply. Buyer data includes GST number, phone number, and trade name.  

The system also tracks **loans**, as the client often takes items from suppliers or gives items to buyers without immediate payment. For each buyer and supplier, the application stores loan details, including the loan rate.  

Each item record includes:
- Unique ID  
- Name  
- Weight  
- Company name  
- Quantity available in stock  
- MRP  
- Cost price
- Selling price  
- Tax rate

For every purchase, the system records:
- Bill number  
- Supplier GST number  
- Date  
- Driver details  
- List of items received (with name, quantity, price, discount, and amount)

For every sale, the system records:
- Bill number  
- Buyer GST number  
- Date  
- Driver details  
- List of items sold (with name, quantity, price, discount, and amount)

---

## Contributors
- [Siddhant Baranwal](https://github.com/Siddhant-Baranwal)  
- [Lakshya Vats](https://github.com/p1x3lph4nt0m)  
- [Shubhranshu Verma](https://github.com/shubhuu-ops)  
- [Saksham Puri](https://github.com/sakshampuri21)  
- [Kush Gupta](https://github.com/kushstudentcse23-jpg)

---

## Related Links
- [Frontend Repository](https://github.com/Siddhant-Baranwal/DBMS_frontend)  
- [Backend Repository](https://github.com/p1x3lph4nt0m/DBMS_proj)
