class Customer{
    public id: number;
    public name: string;
    public email: string;
    public shippingAddress: string;

    constructor(id: number, name: string, email: string, shippingAddress: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.shippingAddress = shippingAddress;
    }
    getDetails(): string{
        return `Id:${this.id}, Name:${this.name}, Email:${this.email}, Shipping Address:${this.shippingAddress}`;
    }
}

abstract class Product{
    public id: number;
    public name: string;
    public price: number;
    public stock: number;

    constructor(id:number,name:string,price:number,stock:number) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }

    sell(quantity: number): void{
        if (quantity <= 0) {
            console.log(`so luong can ban phai lon hon 0`);
        }
        if (this.stock > quantity) {
            console.log(`so luong hang trong kho khong du de ban`);
        }
        this.stock -= quantity;
    }

    restock(quantity: number): void{
        if (quantity <= 0) {
            console.log(`so luong hang them vao phai lon hon 0`);
        }
        this.stock += quantity;
    }
    abstract getProductInfo(): string;
    abstract getShippingCost(distance: number): number;
    abstract getCategory(): string;
}

class ElectronicsProduct extends Product{
   public warrantyPeriod: number//thoi gian bao hanh theo thang
    
    constructor(id: number, name: string, price: number, stock: number, warrantyPeriod: number) {
        super(id, name, price, stock);
        this.warrantyPeriod = warrantyPeriod;
    }
    getProductInfo(): string {
        return `ID:${this.id},NAME:${this.name},PRICE:${this.price},WARRANTY:${this.warrantyPeriod},STOCK:${this.stock}`;   
    }
    getCategory(): string {
        return "Electronics";
    }
    getShippingCost(distance: number): number {
        return 50000;
    }
}

class ClothingProduct extends Product{
    public size: string;
    public color: string;

    constructor(id: number, name: string, price: number, stock: number, size: string, color: string) {
        super(id, name, price, stock);
        this.size = size;
        this.color = color;
    }
    getProductInfo(): string {
        return `ID:${this.id},NAME:${this.name},PRICE:${this.price},STOCK:${this.stock},SIZE:${this.size},COLOR:${this.color}`;
        
    }

    getCategory(): string {
        return "Clothing"
    }
    getShippingCost(distance: number): number {
        return 25000;
    }
}

class Order{
    public orderId: number;
    public customer: string;
    public products: { product: Product, quantity: number }[];
    public totalAmount: number;

    constructor(orderId: number, customer: string, products: { product: Product, quantity: number }[], totalAmount: number) {
        this.orderId = orderId;
        this.customer = customer;
        this.products = products;
        this.totalAmount = totalAmount;
    }

    getDetails(): string{
         return `Order ${this.orderId} - Khách: ${this.customer} - Tổng: ${this.totalAmount}`;
    }
}

class Store{
    public products: Product[];
    public customers: Customer[];
    public orders: Order[];

    constructor(products: Product[], customers: Customer[], orders: Order[]) {
        this.products = products;
        this.customers = customers;
        this.orders = orders;
    }
    
    addProduct(product: Product): void{
        this.products.push(product);
    }

    addCustomer(name: string, email: string, address: string): void{
         const id = this.customers.length + 1;
        this.customers.push(new Customer(id, name, email, address));
    }
    findEntityById<T extends { id: number }>(collection: T[], id: number): T | undefined {
        return collection.find(item => item.id === id);
    }

    createOrder(customerId: number, productQuantities: { productId: number, quantity: number }[]): Order | null{
        const customer = this.findEntityById(this.customers, customerId);
        if (!customer) {
            console.log("khong tim thay khach hang");
            return null;
        }
        let totalAmount = 0;
        const items: { product: Product, quantity: number }[] = [];

        for (let pq of productQuantities) {
            const product = this.findEntityById(this.products, pq.productId);
            if (!product) {
                console.log(`khong tim thay san pham voi id: ${pq.productId}`);
                return null;
            }
            if (product.stock < pq.quantity) {
                console.log(`so luong hang trong kho khong du`);
                return null;
                
            }
            product.stock -= pq.quantity;
            totalAmount += product.price * pq.quantity;
            items.push({ product, quantity: pq.quantity });
        }
        const order = new Order(
            this.orders.length + 1, customer.name, items, totalAmount
        );
        this.orders.push(order);
        return order;
    }
    cancelOrder(orderId: number): void{
          const index = this.orders.findIndex(o => o.orderId === orderId);
        if (index === -1) {
            console.log(`Không tìm thấy đơn hàng ${orderId}`);
            return;
        }
        const order = this.orders[index];
        order.products.forEach(item => {
            item.product.stock += item.quantity;
        });
        this.orders.splice(index, 1);
        console.log(`Đơn hàng ${orderId} đã bị hủy.`);
    }
    listAvailableProducts(): void{
         const available = this.products.filter(p => p.stock > 0);
        available.forEach(p => console.log(p.getProductInfo()));
    }
    listCustomerOrders(customerId: number): void{
        const customer = this.findEntityById(this.customers, customerId);
        if (!customer) {
            console.log("Không tìm thấy khách hàng.");
            return;
        }
        const orders = this.orders.filter(o => o.customer === customer.name);
        orders.forEach(o => console.log(o.getDetails()));
    }
    calculateTotalRevenue(): number{
         return this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    }
    countProductsByCategory(): void{
         const categoryCount = this.products.reduce((acc, p) => {
            const category = p.getCategory();
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        console.log(categoryCount);
    }
    updateProductStock(productId: number, newStock: number): void{
        const product = this.findEntityById(this.products, productId);
        if (!product) {
            console.log("Không tìm thấy sản phẩm.");
            return;
        }
        product.stock = newStock;
        console.log(`Cập nhật tồn kho cho ${product.name} thành ${newStock}`);
    }
}
    
  