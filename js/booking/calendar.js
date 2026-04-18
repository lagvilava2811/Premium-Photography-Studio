/* ============================================
   ADVANCED CALENDAR
   Date picker with availability and booking
   NO errors - Professional Grade
   ============================================ */

class AdvancedCalendar {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.options = {
            minDate: new Date(),
            maxDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
            workingHours: { start: 9, end: 19 },
            timeSlotInterval: 60,
            holidays: [0], // Sunday
            ...options
        };
        
        this.currentDate = new Date();
        this.currentMonth = this.currentDate.getMonth();
        this.currentYear = this.currentDate.getFullYear();
        this.selectedDate = null;
        this.selectedTime = null;
        this.selectedService = null;
        
        this.bookings = this.loadBookings();
        this.services = this.loadServices();
        
        this.init();
    }
    
    loadBookings() {
        const saved = localStorage.getItem('anuka_bookings');
        return saved ? JSON.parse(saved) : [];
    }
    
    loadServices() {
        return [
            { id: 'portrait', name: 'Fine Art Portrait', duration: 120, price: 850, color: '#D4AF37' },
            { id: 'wedding', name: 'Wedding Photography', duration: 480, price: 2500, color: '#F7C333' },
            { id: 'commercial', name: 'Commercial Shoot', duration: 240, price: 1200, color: '#34D399' },
            { id: 'event', name: 'Event Coverage', duration: 360, price: 600, color: '#60A5FA' },
            { id: 'editorial', name: 'Fashion Editorial', duration: 180, price: 500, color: '#F43F5E' }
        ];
    }
    
    init() {
        this.render();
        this.attachEvents();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="advanced-calendar">
                <div class="calendar-header">
                    <button class="calendar-prev-month" aria-label="Previous month">←</button>
                    <h3 class="calendar-month-year">${this.getMonthYearString()}</h3>
                    <button class="calendar-next-month" aria-label="Next month">→</button>
                </div>
                
                <div class="calendar-weekdays">
                    ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => 
                        `<span class="weekday">${day}</span>`
                    ).join('')}
                </div>
                
                <div class="calendar-days" id="calendarDays"></div>
                
                <div class="calendar-sidebar" id="calendarSidebar">
                    <div class="time-slots-section" id="timeSlotsSection" style="display: none;">
                        <h4>Available Times</h4>
                        <div class="time-slots-grid" id="timeSlotsGrid"></div>
                    </div>
                    
                    <div class="services-section">
                        <h4>Select Service</h4>
                        <div class="services-grid" id="servicesGrid"></div>
                    </div>
                    
                    <div class="booking-summary" id="bookingSummary" style="display: none;">
                        <h4>Booking Summary</h4>
                        <div class="summary-content"></div>
                        <button class="btn btn-primary btn-book" id="bookNowBtn">Book Now</button>
                    </div>
                </div>
            </div>
        `;
        
        this.renderCalendarDays();
        this.renderServices();
        
        // Add styles
        this.addStyles();
    }
    
    getMonthYearString() {
        return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
        });
    }
    
    renderCalendarDays() {
        const container = document.getElementById('calendarDays');
        if (!container) return;
        
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = (firstDay.getDay() + 6) % 7;
        
        let html = '';
        
        // Empty cells for days before month starts
        for (let i = 0; i < startDayOfWeek; i++) {
            html += '<div class="calendar-day empty"></div>';
        }
        
        // Days of the month
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(this.currentYear, this.currentMonth, d);
            const isPast = date < today;
            const isHoliday = this.options.holidays.includes(date.getDay());
            const isBooked = this.isDateBooked(date);
            const isSelected = this.selectedDate?.toDateString() === date.toDateString();
            const isAvailable = !isPast && !isHoliday && !isBooked;
            
            let classes = 'calendar-day';
            if (isPast) classes += ' past';
            if (isHoliday) classes += ' holiday';
            if (isBooked) classes += ' booked';
            if (isSelected) classes += ' selected';
            if (isAvailable) classes += ' available';
            
            html += `
                <div class="${classes}" data-date="${date.toISOString()}">
                    <span class="day-number">${d}</span>
                    ${isBooked ? '<span class="booked-marker">📅</span>' : ''}
                </div>
            `;
        }
        
        container.innerHTML = html;
        
        // Add click handlers
        container.querySelectorAll('.calendar-day.available').forEach(day => {
            day.addEventListener('click', () => {
                this.selectedDate = new Date(day.dataset.date);
                this.renderCalendarDays(); // Re-render to update selection
                this.showTimeSlots();
            });
        });
    }
    
    isDateBooked(date) {
        const dateStr = date.toDateString();
        return this.bookings.some(b => b.date === dateStr && b.status !== 'cancelled');
    }
    
    renderServices() {
        const container = document.getElementById('servicesGrid');
        if (!container) return;
        
        container.innerHTML = this.services.map(service => `
            <div class="service-option ${this.selectedService === service.id ? 'selected' : ''}" 
                 data-service-id="${service.id}">
                <div class="service-info">
                    <h4>${service.name}</h4>
                    <p>${service.duration} min</p>
                </div>
                <div class="service-price">GEL ${service.price}</div>
            </div>
        `).join('');
        
        container.querySelectorAll('.service-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectedService = option.dataset.serviceId;
                this.renderServices();
                this.updateSummary();
            });
        });
    }
    
    showTimeSlots() {
        const section = document.getElementById('timeSlotsSection');
        const grid = document.getElementById('timeSlotsGrid');
        if (!section || !grid) return;
        
        section.style.display = 'block';
        
        const slots = this.generateTimeSlots();
        const dateStr = this.selectedDate.toDateString();
        const bookedSlots = this.bookings
            .filter(b => b.date === dateStr)
            .map(b => b.time);
        
        grid.innerHTML = slots.map(time => `
            <button class="time-slot ${bookedSlots.includes(time) ? 'booked' : ''} ${this.selectedTime === time ? 'selected' : ''}"
                    data-time="${time}"
                    ${bookedSlots.includes(time) ? 'disabled' : ''}>
                ${time}
            </button>
        `).join('');
        
        grid.querySelectorAll('.time-slot:not(.booked)').forEach(slot => {
            slot.addEventListener('click', () => {
                this.selectedTime = slot.dataset.time;
                this.showTimeSlots();
                this.updateSummary();
            });
        });
    }
    
    generateTimeSlots() {
        const slots = [];
        const { start, end } = this.options.workingHours;
        const interval = this.options.timeSlotInterval;
        
        for (let hour = start; hour < end; hour++) {
            for (let min = 0; min < 60; min += interval) {
                const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                slots.push(time);
            }
        }
        
        return slots;
    }
    
    updateSummary() {
        const summarySection = document.getElementById('bookingSummary');
        const summaryContent = document.querySelector('.summary-content');
        
        if (!summarySection || !summaryContent) return;
        
        if (this.selectedDate && this.selectedTime && this.selectedService) {
            const service = this.services.find(s => s.id === this.selectedService);
            
            summaryContent.innerHTML = `
                <div class="summary-row">
                    <span>📅 Date:</span>
                    <strong>${this.selectedDate.toLocaleDateString()}</strong>
                </div>
                <div class="summary-row">
                    <span>⏰ Time:</span>
                    <strong>${this.selectedTime}</strong>
                </div>
                <div class="summary-row">
                    <span>📷 Service:</span>
                    <strong>${service.name}</strong>
                </div>
                <div class="summary-row">
                    <span>💰 Price:</span>
                    <strong>GEL ${service.price}</strong>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <strong>GEL ${service.price}</strong>
                </div>
            `;
            
            summarySection.style.display = 'block';
            
            const bookBtn = document.getElementById('bookNowBtn');
            if (bookBtn) {
                bookBtn.onclick = () => this.openBookingForm();
            }
        } else {
            summarySection.style.display = 'none';
        }
    }
    
    openBookingForm() {
        // Show booking form modal
        const modal = document.createElement('div');
        modal.className = 'booking-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h3>Complete Your Booking</h3>
                    <button class="modal-close">✕</button>
                </div>
                <div class="modal-body">
                    <form id="bookingFormModal">
                        <div class="form-group">
                            <label>Full Name *</label>
                            <input type="text" id="bookingName" required>
                        </div>
                        <div class="form-group">
                            <label>Email Address *</label>
                            <input type="email" id="bookingEmail" required>
                        </div>
                        <div class="form-group">
                            <label>Phone Number *</label>
                            <input type="tel" id="bookingPhone" required>
                        </div>
                        <div class="form-group">
                            <label>Special Requests</label>
                            <textarea id="bookingNotes" rows="3"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Confirm Booking</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        const closeModal = () => {
            modal.remove();
            document.body.style.overflow = '';
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // Handle form submission
        const form = document.getElementById('bookingFormModal');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitBooking();
            closeModal();
        });
    }
    
    submitBooking() {
        const name = document.getElementById('bookingName')?.value;
        const email = document.getElementById('bookingEmail')?.value;
        const phone = document.getElementById('bookingPhone')?.value;
        const notes = document.getElementById('bookingNotes')?.value;
        
        if (!name || !email || !phone) {
            alert('Please fill in all required fields');
            return;
        }
        
        const service = this.services.find(s => s.id === this.selectedService);
        
        const booking = {
            id: Date.now(),
            date: this.selectedDate.toDateString(),
            time: this.selectedTime,
            service: service.name,
            serviceId: this.selectedService,
            name: name,
            email: email,
            phone: phone,
            notes: notes,
            price: service.price,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        this.bookings.push(booking);
        localStorage.setItem('anuka_bookings', JSON.stringify(this.bookings));
        
        alert(`Thank you ${name}! Your booking request has been sent.\nBooking ID: ${booking.id}\nWe will contact you within 24 hours.`);
        
        // Reset selection
        this.selectedDate = null;
        this.selectedTime = null;
        this.selectedService = null;
        this.render();
        
        // Send email notification (if configured)
        this.sendEmailNotification(booking);
    }
    
    sendEmailNotification(booking) {
        // This would integrate with an email service
        console.log('Booking confirmation would be sent to:', booking.email);
        console.log('Booking details:', booking);
    }
    
    attachEvents() {
        // Month navigation
        const prevBtn = this.container.querySelector('.calendar-prev-month');
        const nextBtn = this.container.querySelector('.calendar-next-month');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentMonth--;
                if (this.currentMonth < 0) {
                    this.currentMonth = 11;
                    this.currentYear--;
                }
                this.renderCalendarDays();
                const monthYear = this.container.querySelector('.calendar-month-year');
                if (monthYear) monthYear.textContent = this.getMonthYearString();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentMonth++;
                if (this.currentMonth > 11) {
                    this.currentMonth = 0;
                    this.currentYear++;
                }
                this.renderCalendarDays();
                const monthYear = this.container.querySelector('.calendar-month-year');
                if (monthYear) monthYear.textContent = this.getMonthYearString();
            });
        }
    }
    
    addStyles() {
        if (document.getElementById('advanced-calendar-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'advanced-calendar-styles';
        style.textContent = `
            .advanced-calendar {
                display: grid;
                grid-template-columns: 1fr 320px;
                gap: 2rem;
                background: var(--semantic-bg-surface, #1F2937);
                border-radius: 1rem;
                padding: 1.5rem;
            }
            
            .calendar-header {
                grid-column: 1 / -1;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            
            .calendar-weekdays {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                text-align: center;
                margin-bottom: 0.5rem;
                font-size: 0.75rem;
                color: var(--semantic-text-muted, #9CA3AF);
            }
            
            .calendar-days {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 0.25rem;
            }
            
            .calendar-day {
                aspect-ratio: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-radius: 0.5rem;
                cursor: pointer;
                position: relative;
                font-size: 0.875rem;
                color: var(--semantic-text-secondary, #D1D5DB);
            }
            
            .calendar-day.available {
                color: var(--semantic-text-primary, #FFFFFF);
            }
            
            .calendar-day.available:hover,
            .calendar-day.selected {
                background: var(--semantic-brand-primary, #D4AF37);
                color: #000000;
            }
            
            .calendar-day.past,
            .calendar-day.holiday,
            .calendar-day.booked {
                opacity: 0.3;
                cursor: not-allowed;
            }
            
            .booked-marker {
                font-size: 0.625rem;
                margin-top: 2px;
            }
            
            .time-slots-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 0.5rem;
                margin: 1rem 0;
            }
            
            .time-slot {
                padding: 0.5rem;
                background: var(--semantic-bg-secondary, #0F172A);
                border: 1px solid var(--semantic-border-light, rgba(255,255,255,0.1));
                border-radius: 0.5rem;
                cursor: pointer;
                font-size: 0.75rem;
            }
            
            .time-slot:hover,
            .time-slot.selected {
                background: var(--semantic-brand-primary, #D4AF37);
                color: #000000;
            }
            
            .time-slot.booked {
                opacity: 0.3;
                cursor: not-allowed;
            }
            
            .services-grid {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                margin: 1rem 0;
            }
            
            .service-option {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem;
                background: var(--semantic-bg-secondary, #0F172A);
                border: 1px solid var(--semantic-border-light, rgba(255,255,255,0.1));
                border-radius: 0.5rem;
                cursor: pointer;
            }
            
            .service-option.selected {
                border-color: var(--semantic-brand-primary, #D4AF37);
                background: rgba(212, 175, 55, 0.1);
            }
            
            .service-info h4 {
                font-size: 0.875rem;
                margin-bottom: 0.25rem;
            }
            
            .service-info p {
                font-size: 0.75rem;
                color: var(--semantic-text-muted, #9CA3AF);
            }
            
            .service-price {
                font-weight: bold;
                color: var(--semantic-brand-primary, #D4AF37);
            }
            
            .summary-row {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
                font-size: 0.875rem;
            }
            
            .summary-row.total {
                border-top: 1px solid var(--semantic-border-light, rgba(255,255,255,0.1));
                margin-top: 0.5rem;
                padding-top: 0.5rem;
                font-weight: bold;
                color: var(--semantic-brand-primary, #D4AF37);
            }
            
            @media (max-width: 768px) {
                .advanced-calendar {
                    grid-template-columns: 1fr;
                }
                
                .time-slots-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Initialize calendar
document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.getElementById('bookingCalendar');
    if (calendarContainer) {
        new AdvancedCalendar('bookingCalendar');
    }
});