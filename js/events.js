/**
 * イベントページの機能を管理するJavaScriptファイル
 * カレンダー表示、イベントリストの管理、フィルタリング機能を提供
 */

document.addEventListener('DOMContentLoaded', function() {
    // モバイルメニューの制御
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navItems = document.querySelector('.nav-items');
    const navOverlay = document.querySelector('.nav-overlay');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        navItems.classList.toggle('active');
        navOverlay.classList.toggle('active');
        mobileMenuBtn.innerHTML = isMenuOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        mobileMenuBtn.setAttribute('aria-label', isMenuOpen ? 'メニューを閉じる' : 'メニューを開く');
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    // カレンダー機能の実装
    class EventCalendar {
        constructor() {
            this.currentDate = new Date();
            this.calendarDays = document.querySelector('.calendar-days');
            this.currentMonthElement = document.querySelector('.current-month');
            this.prevMonthButton = document.querySelector('.prev-month');
            this.nextMonthButton = document.querySelector('.next-month');
            this.events = this.getEvents();
            this.modal = document.querySelector('.event-modal');
            this.modalClose = document.querySelector('.modal-close');

            this.initializeCalendar();
            this.bindEvents();
            this.initializeModal();
        }

        initializeCalendar() {
            this.updateMonthDisplay();
            this.renderCalendar();
        }

        bindEvents() {
            this.prevMonthButton.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.updateMonthDisplay();
                this.renderCalendar();
            });

            this.nextMonthButton.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.updateMonthDisplay();
                this.renderCalendar();
            });
        }

        updateMonthDisplay() {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth() + 1;
            this.currentMonthElement.textContent = `${year}年${month}月`;
        }

        renderCalendar() {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            
            let calendarHTML = '';

            // 前月の日付を埋める
            const firstDayOfWeek = firstDay.getDay();
            const prevMonthLastDay = new Date(year, month, 0).getDate();
            
            for (let i = firstDayOfWeek - 1; i >= 0; i--) {
                const day = prevMonthLastDay - i;
                calendarHTML += `
                    <div class="calendar-day inactive">
                        <span class="day-number">${day}</span>
                    </div>
                `;
            }

            // 当月の日付を埋める
            for (let day = 1; day <= lastDay.getDate(); day++) {
                const date = new Date(year, month, day);
                const isToday = this.isToday(date);
                const dayEvents = this.getEventsForDate(date);
                const hasEvent = dayEvents.length > 0;
                
                calendarHTML += `
                    <div class="calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">
                        <span class="day-number">${day}</span>
                        ${dayEvents.map(event => `
                            <div class="event-summary" data-event-id="${event.date.getTime()}">
                                <span class="event-time">${event.time.split(' - ')[0]}</span>
                                ${event.title}
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            // 翌月の日付を埋める
            const lastDayOfWeek = lastDay.getDay();
            let nextMonthDay = 1;
            for (let i = lastDayOfWeek + 1; i < 7; i++) {
                calendarHTML += `
                    <div class="calendar-day inactive">
                        <span class="day-number">${nextMonthDay}</span>
                    </div>
                `;
                nextMonthDay++;
            }

            this.calendarDays.innerHTML = calendarHTML;
            this.addEventClickHandlers();
        }

        isToday(date) {
            const today = new Date();
            return date.getDate() === today.getDate() &&
                   date.getMonth() === today.getMonth() &&
                   date.getFullYear() === today.getFullYear();
        }

        getEventsForDate(date) {
            return this.events.filter(event => 
                event.date.getDate() === date.getDate() &&
                event.date.getMonth() === date.getMonth() &&
                event.date.getFullYear() === date.getFullYear()
            );
        }

        getEvents() {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();

            return [
                // 先月のイベント
                {
                    date: new Date(currentYear, currentMonth - 1, 15),
                    title: 'ビギナーズスクール',
                    type: 'school',
                    time: '10:00 - 16:00',
                    price: '参加費: ¥15,000',
                    description: '初心者向けドライビングスクール',
                    image: './images/driving-school.jpg'
                },
                {
                    date: new Date(currentYear, currentMonth - 1, 25),
                    title: 'スプリントレース',
                    type: 'race',
                    time: '9:00 - 17:00',
                    price: '参加費: ¥25,000',
                    description: '短距離走行によるタイムアタック',
                    image: './images/race-event.jpg'
                },

                // 今月のイベント
                {
                    date: new Date(currentYear, currentMonth, 5),
                    title: 'モータースポーツフェスティバル',
                    type: 'festival',
                    time: '9:00 - 17:00',
                    price: '観戦チケット: ¥3,000〜',
                    description: '様々なレースマシンによるデモ走行と展示',
                    image: './images/hero-track.jpg'
                },
                {
                    date: new Date(currentYear, currentMonth, 12),
                    title: 'レーシングカート大会',
                    type: 'race',
                    time: '10:00 - 16:00',
                    price: '参加費: ¥8,000',
                    description: 'レンタルカートによる耐久レース',
                    image: './images/track-aerial.jpg'
                },
                {
                    date: new Date(currentYear, currentMonth, 19),
                    title: '安全運転講習会',
                    type: 'school',
                    time: '13:00 - 16:00',
                    price: '参加費: ¥10,000',
                    description: '日常運転に活かせる安全運転テクニック',
                    image: './images/driving-school.jpg'
                },
                {
                    date: new Date(currentYear, currentMonth, 26),
                    title: 'スポーツ走行会',
                    type: 'experience',
                    time: '9:00 - 16:00',
                    price: '参加費: ¥20,000',
                    description: '愛車でサーキットを楽しむ走行会',
                    image: './images/track-day.jpg'
                },

                // 来月のイベント
                {
                    date: new Date(currentYear, currentMonth + 1, 3),
                    title: 'ドライビングレッスン',
                    type: 'school',
                    time: '10:00 - 15:00',
                    price: '参加費: ¥30,000',
                    description: 'プロドライバーによるマンツーマン指導',
                    image: './images/driving-school.jpg'
                },
                {
                    date: new Date(currentYear, currentMonth + 1, 10),
                    title: 'エンデュランスレース',
                    type: 'race',
                    time: '8:00 - 18:00',
                    price: '参加費: ¥40,000/チーム',
                    description: '4時間耐久レース',
                    image: './images/race-event.jpg'
                },
                {
                    date: new Date(currentYear, currentMonth + 1, 17),
                    title: 'メカニック講座',
                    type: 'school',
                    time: '13:00 - 16:00',
                    price: '参加費: ¥12,000',
                    description: '基礎的な車両メンテナンスを学ぶ',
                    image: './images/pit.jpg'
                },
                {
                    date: new Date(currentYear, currentMonth + 1, 24),
                    title: 'ナイトラン',
                    type: 'special',
                    time: '18:00 - 21:00',
                    price: '参加費: ¥25,000',
                    description: '夜間走行を体験する特別イベント',
                    image: './images/paddock.jpg'
                }
            ];
        }

        initializeModal() {
            this.modalClose.addEventListener('click', () => {
                this.closeModal();
            });

            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeModal();
                }
            });
        }

        showModal(event) {
            const modalTitle = this.modal.querySelector('.modal-header h3');
            const modalDate = this.modal.querySelector('.event-date');
            const modalTime = this.modal.querySelector('.event-time');
            const modalPrice = this.modal.querySelector('.event-price');
            const modalDescription = this.modal.querySelector('.event-description');

            modalTitle.textContent = event.title;
            modalDate.textContent = `${event.date.getFullYear()}年${event.date.getMonth() + 1}月${event.date.getDate()}日`;
            modalTime.textContent = event.time;
            modalPrice.textContent = event.price;
            modalDescription.textContent = event.description;

            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        closeModal() {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        addEventClickHandlers() {
            const eventSummaries = document.querySelectorAll('.event-summary');
            eventSummaries.forEach(summary => {
                summary.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const eventId = parseInt(summary.dataset.eventId);
                    const event = this.events.find(event => event.date.getTime() === eventId);
                    if (event) {
                        this.showModal(event);
                    }
                });
            });
        }

        initialize() {
            this.initializeCalendar();
            this.bindEvents();
            this.initializeModal();
        }
    }

    // カレンダーの初期化
    const calendar = new EventCalendar();

    // イベントリストの表示
    function initializeEventList() {
        const events = calendar.getEvents();
        
        // イベントをタイプごとにグループ化
        const groupedEvents = {
            race: events.filter(event => event.type === 'race' || event.type === 'festival'),
            school: events.filter(event => event.type === 'school'),
            experience: events.filter(event => event.type === 'experience' || event.type === 'special')
        };

        // レース系イベント
        const raceList = document.querySelector('.event-category:nth-of-type(1) .event-list');
        if (raceList) {
            raceList.innerHTML = groupedEvents.race.map(event => createEventCard(event)).join('');
        }

        // ドライビングスクール
        const schoolList = document.querySelector('.event-category:nth-of-type(2) .event-list');
        if (schoolList) {
            schoolList.innerHTML = groupedEvents.school.map(event => createEventCard(event)).join('');
        }

        // 一般走行会
        const experienceList = document.querySelector('.event-category:nth-of-type(3) .event-list');
        if (experienceList) {
            experienceList.innerHTML = groupedEvents.experience.map(event => createEventCard(event)).join('');
        }
    }

    function createEventCard(event) {
        const date = event.date;
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        return `
            <div class="card fade-in">
                <div class="card-image">
                    <img src="${event.image || './images/track-day.jpg'}" alt="${event.title}">
                    <span class="event-date">${month}月${day}日</span>
                </div>
                <div class="card-content">
                    <h4 class="card-title">${event.title}</h4>
                    <p class="card-text">${event.description}</p>
                    <ul>
                        <li><i class="far fa-clock"></i> ${event.time}</li>
                        <li><i class="fas fa-yen-sign"></i> ${event.price}</li>
                    </ul>
                    <a href="#" class="btn">詳細を見る</a>
                </div>
            </div>
        `;
    }

    // 過去のイベントアーカイブの表示
    function getPastEvents() {
        return [
            {
                title: '2023年スーパーGT最終戦',
                date: '2023年11月15日',
                description: '2023年シーズンの締めくくりとなる白熱のレース',
                image: './images/race-event.jpg',
                time: '8:00 - 17:00',
                price: '観戦チケット: ¥5,000〜',
                type: 'race'
            },
            {
                title: '冬季ドライビングスクール',
                date: '2023年12月1-2日',
                description: '寒冷期の特別なドライビングテクニックを学ぶ',
                image: './images/driving-school.jpg',
                time: '9:00 - 16:00',
                price: '参加費: ¥50,000',
                type: 'school'
            },
            {
                title: '年末スペシャル耐久レース',
                date: '2023年12月23日',
                description: '年末恒例の6時間耐久レース。チーム戦で行われる特別イベント',
                image: './images/track-aerial.jpg',
                time: '8:00 - 18:00',
                price: '参加費: ¥60,000/チーム',
                type: 'race'
            },
            {
                title: 'ウィンターナイトラン',
                date: '2023年12月30日',
                description: '年末の夜を彩る特別な夜間走行イベント',
                image: './images/paddock.jpg',
                time: '17:00 - 21:00',
                price: '参加費: ¥30,000',
                type: 'special'
            }
        ];
    }

    function initializePastEvents() {
        const archiveList = document.querySelector('.archive-list');
        const pastEvents = getPastEvents();

        if (archiveList) {
            let archiveHTML = '';
            pastEvents.forEach(event => {
                archiveHTML += `
                    <div class="card fade-in">
                        <div class="card-image">
                            <img src="${event.image}" alt="${event.title}">
                            <div class="event-badge ${event.type}">${getEventTypeLabel(event.type)}</div>
                            <span class="event-date">${event.date}</span>
                        </div>
                        <div class="card-content">
                            <h4 class="card-title">${event.title}</h4>
                            <p class="card-text">${event.description}</p>
                            <ul class="event-details">
                                <li><i class="far fa-clock"></i> ${event.time}</li>
                                <li><i class="fas fa-yen-sign"></i> ${event.price}</li>
                            </ul>
                            <div class="card-footer">
                                <a href="#" class="btn">アーカイブを見る</a>
                                <span class="event-status">終了</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            archiveList.innerHTML = archiveHTML;
        }
    }

    function getEventTypeLabel(type) {
        const types = {
            race: 'レース',
            school: 'スクール',
            experience: '体験',
            special: 'スペシャル',
            festival: 'フェスティバル'
        };
        return types[type] || '';
    }

    // 初期化の実行
    initializeEventList();
    initializePastEvents();
}); 