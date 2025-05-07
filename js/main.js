const tabData = {
    main: [
        { title: 'Экономика', description: 'Полноценная экономическая система для вашего сервера', price: '1,000 ₽' },
        { title: 'Кланы', description: 'Система кланов с рейтингами и возможностями управления', price: '500 ₽' },
        { title: 'Стафф', description: 'Управление персоналом и отслеживание их статистики. Проверка на дабл стаффСистема наборов в стафф', price: '800 ₽' }
    ],
    protection: [
        { title: 'Верификация', description: 'Система верификации пользователей с отслеживанием статистики', price: '400 ₽' },
        { title: 'Модерация', description: 'Инструмент для модерации пользователей и отслеживании статистики', price: '600 ₽' },
        { title: 'Антикраш', description: 'Защита сервера от рейдов и вредоносных действий с гибкой настройкой', price: '800 ₽' },
        { title: 'Автоверификация', description: 'Автоматическая голосовая верификация пользователей', price: '1,500 ₽' }
    ],
    events: [
        { title: 'Ивенты', description: 'Инструмент создания и управления ивентами на сервере', price: '600 ₽' },
        { title: 'Креатив', description: 'Инструмент создания афиш и управления для креативов', price: '450 ₽' },
        { title: 'Клозы', description: 'Инструмент создания и управления клозами на сервере', price: '600 ₽' },
        { title: 'Трибун', description: 'Автоматизированная система создания мероприятий', price: '500 ₽' },
        { title: 'Мафия', description: 'Автоматизированная игра в мафию для вашего сервера', price: '1,000 ₽' }
    ],
    tools: [
        { title: 'Баннер', description: 'Автоматически обновляемый баннер со статистикой', price: '200 ₽' },
        { title: 'Помощь - вопрос', description: 'Система поддержки пользователей и ответов на вопросы', price: '200 ₽' },
        { title: 'Приватки', description: 'Система приватных каналов для пользователей', price: '200 ₽' }
    ],
    hosting: [
        { title: 'Базовый хостинг', description: 'Хостинг для одного бота с поддержкой 24/7', price: '70 ₽ /мес' },
        { title: 'Полный пакет', description: 'Хостинг для всех ботов с приоритетной поддержкой', price: '750 ₽ /мес' }
    ]
};

const packagePrices = {
    main: '2,300 ₽',
    protection: '3,300 ₽',
    events: '3,150 ₽',
    tools: '600 ₽'
};

const cart = {
    items: [],
    total: 0
};

function createCard(service) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-header">
            <h3 class="card-title">${service.title}</h3>
            <p class="card-description">${service.description}</p>
        </div>
        <div class="card-content">
            <p class="price">${service.price}</p>
        </div>
        <div class="card-footer">
            <button class="order-button" data-title="${service.title}" data-price="${service.price}">
                <i class="fas fa-shopping-cart"></i> Заказать
            </button>
        </div>
    `;
    return card;
}

function generateTabContent(services, tabId) {
    const content = document.createElement('div');
    content.className = 'tab-content';

    const cards = document.createElement('div');
    cards.className = 'cards';

    services.forEach(service => {
        cards.appendChild(createCard(service));
    });

    content.appendChild(cards);

    if (packagePrices[tabId]) {
        const packagePrice = document.createElement('div');
        packagePrice.className = 'package-price';
        packagePrice.innerHTML = `<p class="font-semibold">Полный пакет "${
            tabId === 'main' ? 'Основное' :
            tabId === 'protection' ? 'Защита' :
            tabId === 'events' ? 'Мероприятия' :
            'Инструменты'
        }": <span>${packagePrices[tabId]}</span></p>`;
        content.appendChild(packagePrice);
    }

    return content;
}

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContent = document.getElementById('tabContent');
    const cartButton = document.getElementById('cartButton');
    const cartElement = document.getElementById('cart');
    const cartCheckout = document.getElementById('cartCheckout');
    const cartCount = document.getElementById('cartCount');

    showTab('main');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            showTab(button.dataset.tab);
        });
    });

    cartButton.addEventListener('click', () => {
        cartElement.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        const button = e.target.closest('.order-button');
        if (button) {
            const title = button.dataset.title;
            const priceText = button.dataset.price;
            const price = parseInt(priceText.replace(/[^\d]/g, ''));
            
            addToCart(title, price);

            button.innerHTML = '<i class="fas fa-check"></i> Добавлено';
            button.style.backgroundColor = '#22c55e';
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-shopping-cart"></i> Заказать';
                button.style.backgroundColor = '';
            }, 1000);
        }
    });

    cartCheckout.addEventListener('click', () => {
        if (cart.items.length === 0) {
            alert('Корзина пуста');
            return;
        }
        
        const message = formatOrderMessage();
        sendToTelegram(message);
    });

    document.getElementById('year').textContent = new Date().getFullYear();

    const player = new MusicPlayer();
});

function showTab(tabId) {
    const tabContent = document.getElementById('tabContent');
    tabContent.innerHTML = '';
    tabContent.appendChild(generateTabContent(tabData[tabId], tabId));
}

function addToCart(title, price) {
    cart.items.push({ title, price });
    cart.total += price;
    updateCartDisplay();
    updateCartCount();

    const cartButton = document.getElementById('cartButton');
    cartButton.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartButton.style.transform = '';
    }, 200);
}

function removeFromCart(index) {
    const item = cart.items[index];
    cart.total -= item.price;
    cart.items.splice(index, 1);
    updateCartDisplay();
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    cartCount.textContent = cart.items.length;
    cartCount.style.display = cart.items.length ? 'flex' : 'none';
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartTotal = document.getElementById('cartTotal');

    cartItems.innerHTML = '';

    if (cart.items.length === 0) {
        cartEmpty.style.display = 'block';
        cartTotal.style.display = 'none';
    } else {
        cartEmpty.style.display = 'none';
        cartTotal.style.display = 'block';

        cart.items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price} ₽</div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            cartItems.appendChild(itemElement);
        });
    }

    cartTotal.textContent = `Итого: ${cart.total} ₽`;
}

function formatOrderMessage() {
    let message = 'Привет, хочу заказать ботов\n\nСписок:\n';
    cart.items.forEach((item, index) => {
        message += `${index + 1}. ${item.title} - ${item.price} ₽\n`;
    });
    message += `\nОбщая сумма: ${cart.total} ₽`;
    return message;
}

function sendToTelegram(message) {
    const telegramUsername = '@infernalabuse';
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/${telegramUsername.substring(1)}?text=${encodedMessage}`;
    
    window.open(telegramUrl, '_blank');

    cart.items = [];
    cart.total = 0;
    updateCartDisplay();
    updateCartCount();
}
const playlist = [
    {
        title: "Incolore",
        artist: "YG Pablo",
        url: "music/YG_Pablo_-_Incolore_OKLM_Russie.mp3"
    },
    {
        title: "незаконно",
        artist: "madk1d, nobody",
        url: "music/madk1d, nobody - незаконно.mp3"
    },
    {
        title: "болен",
        artist: "dope17, mapt0v",
        url: "music/dope17, mapt0v – болен.mp3"
    },
    {
        title: "Not My Type",
        artist: "FRIENDLY THUG 52 NGG, kizaru",
        url: "music/FRIENDLY THUG 52 NGG, kizaru - Not My Type.mp3"
    },
    {
        title: "отвратительный король",
        artist: "тёмный принц",
        url: "music/тёмный принц - отвратительный король.mp3"
    },
    {
        title: "metallica",
        artist: "Kai Angel",
        url: "music/Kai Angel - metallica.mp3"
    },
    {
        title: "Beliwhatt",
        artist: "чокаюсь бензином",
        url: "music/Beliwhatt - чокаюсь бензином.mp3"
    },
    {
        title: "так похуй",
        artist: "madk1d",
        url: "music/madk1d - так по.mp3"
    },
    {
        title: "Наследство",
        artist: "ICEGERGERT, SKY RAE",
        url: "music/ICEGERGERT, SKY RAE - Наследство.mp3"
    },
    {
        title: "Мимо постов",
        artist: "somewhaat",
        url: "music/somewhaat - Мимо постов.mp3"
    }
];

class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentTrackIndex = 0;

        this.playButton = document.getElementById('playButton');
        this.prevButton = document.getElementById('prevButton');
        this.nextButton = document.getElementById('nextButton');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressBar = document.getElementById('progressBar');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.trackTitleEl = document.querySelector('.track-title');
        this.trackArtistEl = document.querySelector('.track-artist');
        this.volumeButton = document.getElementById('volumeButton');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.isMuted = false;
        this.previousVolume = 0.1;

        this.initializePlayer();
    }

    initializePlayer() {
        this.playButton.addEventListener('click', () => this.togglePlay());
        this.prevButton.addEventListener('click', () => this.prevTrack());
        this.nextButton.addEventListener('click', () => this.nextTrack());
        this.progressContainer.addEventListener('click', (e) => this.setProgress(e));

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('loadedmetadata', () => {
            this.durationEl.textContent = this.formatTime(this.audio.duration);
        });

        this.volumeSlider.addEventListener('input', () => this.setVolume());
        this.volumeButton.addEventListener('click', () => this.toggleMute());

        this.volumeSlider.value = 10;
        this.setVolume();

        this.loadTrack(0);
    }

    loadTrack(index) {
        this.currentTrackIndex = index;
        const track = playlist[index];
        this.audio.src = track.url;
        this.trackTitleEl.textContent = track.title;
        this.trackArtistEl.textContent = track.artist;

        this.progressBar.style.width = '0%';
        this.currentTimeEl.textContent = '0:00';
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pauseTrack();
        } else {
            this.playTrack();
        }
    }

    playTrack() {
        this.isPlaying = true;
        this.playButton.innerHTML = '<i class="fas fa-pause"></i>';
        this.audio.play();
    }

    pauseTrack() {
        this.isPlaying = false;
        this.playButton.innerHTML = '<i class="fas fa-play"></i>';
        this.audio.pause();
    }

    prevTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + playlist.length) % playlist.length;
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) this.playTrack();
    }

    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % playlist.length;
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) this.playTrack();
    }

    updateProgress() {
        const { currentTime, duration } = this.audio;
        const progressPercent = (currentTime / duration) * 100;
        this.progressBar.style.width = `${progressPercent}%`;
        this.currentTimeEl.textContent = this.formatTime(currentTime);
    }

    setProgress(e) {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        this.audio.currentTime = (clickX / width) * duration;
    }

    setVolume() {
        const volume = this.volumeSlider.value / 100;
        this.audio.volume = volume;
        this.previousVolume = volume;
        this.updateVolumeIcon(volume);
    }

    toggleMute() {
        if (this.isMuted) {
            this.audio.volume = this.previousVolume;
            this.volumeSlider.value = this.previousVolume * 100;
        } else {
            this.previousVolume = this.audio.volume;
            this.audio.volume = 0;
            this.volumeSlider.value = 0;
        }
        this.isMuted = !this.isMuted;
        this.updateVolumeIcon(this.audio.volume);
    }

    updateVolumeIcon(volume) {
        const icon = this.volumeButton.querySelector('i');
        icon.className = 'fas ' + (
            volume === 0 ? 'fa-volume-mute' :
            volume < 0.33 ? 'fa-volume-off' :
            volume < 0.67 ? 'fa-volume-down' :
            'fa-volume-up'
        );
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
