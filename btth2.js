"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readlineSync = require("readline-sync");
class Flight {
    constructor(id, origin, destination, departureTime, availableSeats, price) {
        this.id = id;
        this.origin = origin;
        this.destination = destination;
        this.departureTime = departureTime;
        this.availableSeats = availableSeats;
        this.price = price;
    }
}
class DomesticFlight extends Flight {
    getType() {
        return "Nội địa";
    }
}
class InternationalFlight extends Flight {
    getType() {
        return "Quốc tế";
    }
}
class Passenger {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
class Ticket {
    constructor(id, passengerId, flightId) {
        this.id = id;
        this.passengerId = passengerId;
        this.flightId = flightId;
    }
}
class AirlineSystem {
    constructor() {
        this.passengers = [];
        this.flights = [];
        this.tickets = [];
        this.passengerIdCounter = 1;
        this.flightIdCounter = 1;
        this.ticketIdCounter = 1;
    }
    addPassenger(name) {
        this.passengers.push(new Passenger(this.passengerIdCounter++, name));
        console.log("✅ Đã thêm hành khách.");
    }
    addFlight(type, origin, destination, time, seats, price) {
        if (type === "domestic") {
            this.flights.push(new DomesticFlight(this.flightIdCounter++, origin, destination, time, seats, price));
        }
        else {
            this.flights.push(new InternationalFlight(this.flightIdCounter++, origin, destination, time, seats, price));
        }
        console.log("✅ Đã thêm chuyến bay.");
    }
    bookTicket(passengerId, flightId) {
        const flight = this.flights.find(f => f.id === flightId);
        if (flight && flight.availableSeats > 0) {
            this.tickets.push(new Ticket(this.ticketIdCounter++, passengerId, flightId));
            flight.availableSeats--;
            console.log("✅ Đặt vé thành công.");
        }
        else {
            console.log("❌ Không thể đặt vé.");
        }
    }
    cancelTicket(ticketId) {
        const index = this.tickets.findIndex(t => t.id === ticketId);
        if (index !== -1) {
            const ticket = this.tickets[index];
            const flight = this.flights.find(f => f.id === ticket.flightId);
            if (flight)
                flight.availableSeats++;
            this.tickets.splice(index, 1);
            console.log("✅ Hủy vé thành công.");
        }
        else {
            console.log("❌ Không tìm thấy vé.");
        }
    }
    listAvailableFlights(origin, destination) {
        const available = this.flights.filter(f => f.origin === origin && f.destination === destination && f.availableSeats > 0);
        console.table(available);
    }
    listPassengerTickets(passengerId) {
        const passengerTickets = this.tickets.filter(t => t.passengerId === passengerId);
        console.table(passengerTickets);
    }
    calculateRevenue() {
        return this.tickets.reduce((total, t) => {
            const flight = this.flights.find(f => f.id === t.flightId);
            return total + (flight ? flight.price : 0);
        }, 0);
    }
    countFlightsByType() {
        const result = this.flights.reduce((count, f) => {
            const type = f.getType();
            count[type] = (count[type] || 0) + 1;
            return count;
        }, {});
        console.log(result);
    }
    updateFlightTime(flightId, newTime) {
        const flight = this.flights.find(f => f.id === flightId);
        if (flight) {
            flight.departureTime = newTime;
            console.log("✅ Đã cập nhật giờ bay.");
        }
        else {
            console.log("❌ Không tìm thấy chuyến bay.");
        }
    }
    listPassengersOnFlight(flightId) {
        const passengerList = this.tickets
            .filter(t => t.flightId === flightId)
            .map(t => {
            const p = this.passengers.find(p => p.id === t.passengerId);
            return p ? p.name : "Unknown";
        });
        console.table(passengerList);
    }
}
const system = new AirlineSystem();
while (true) {
    console.log("\n=== MENU HỆ THỐNG HÀNG KHÔNG ===");
    console.log("1. Thêm hành khách mới");
    console.log("2. Thêm chuyến bay mới");
    console.log("3. Đặt vé");
    console.log("4. Hủy vé");
    console.log("5. Danh sách chuyến bay trống theo điểm đi và đến");
    console.log("6. Danh sách vé của hành khách");
    console.log("7. Tính doanh thu");
    console.log("8. Đếm chuyến bay theo loại");
    console.log("9. Cập nhật giờ bay");
    console.log("10. Danh sách hành khách của chuyến bay");
    console.log("11. Thoát");
    const choice = readlineSync.questionInt("Chọn chức năng: ");
    switch (choice) {
        case 1:
            system.addPassenger(readlineSync.question("Tên hành khách: "));
            break;
        case 2:
            const type = readlineSync.question("Loại (domestic/international): ");
            system.addFlight(type, readlineSync.question("Điểm đi: "), readlineSync.question("Điểm đến: "), readlineSync.question("Giờ bay: "), readlineSync.questionInt("Số ghế: "), readlineSync.questionFloat("Giá vé: "));
            break;
        case 3:
            system.bookTicket(readlineSync.questionInt("ID hành khách: "), readlineSync.questionInt("ID chuyến bay: "));
            break;
        case 4:
            system.cancelTicket(readlineSync.questionInt("ID vé: "));
            break;
        case 5:
            system.listAvailableFlights(readlineSync.question("Điểm đi: "), readlineSync.question("Điểm đến: "));
            break;
        case 6:
            system.listPassengerTickets(readlineSync.questionInt("ID hành khách: "));
            break;
        case 7:
            console.log("💰 Tổng doanh thu:", system.calculateRevenue());
            break;
        case 8:
            system.countFlightsByType();
            break;
        case 9:
            system.updateFlightTime(readlineSync.questionInt("ID chuyến bay: "), readlineSync.question("Giờ bay mới: "));
            break;
        case 10:
            system.listPassengersOnFlight(readlineSync.questionInt("ID chuyến bay: "));
            break;
        case 11:
            console.log("👋 Thoát chương trình.");
            process.exit();
    }
}
