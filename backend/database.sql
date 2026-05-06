-- Расширение для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Пользователи
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Категории
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

-- Товары
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  price NUMERIC(10,2) NOT NULL,
  old_price NUMERIC(10,2),
  short_desc TEXT,
  description TEXT,
  inci TEXT,
  usage_guide TEXT,
  volume VARCHAR(50),
  skin_types TEXT[],
  category_id INT REFERENCES categories(id),
  stock INT DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Фотографии товаров
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  is_main BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0
);

-- Корзина
CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Избранное
CREATE TABLE wishlist (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Заказы
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(150),
  address TEXT,
  comment TEXT,
  total NUMERIC(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'created',
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Состав заказа
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  title VARCHAR(255),
  price NUMERIC(10,2),
  quantity INT,
  image_url VARCHAR(500)
);

-- Отзывы
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Категории
INSERT INTO categories (name, slug) VALUES
('Уход за лицом', 'face'),
('Уход за телом', 'body'),
('Уход за волосами', 'hair'),
('Маски', 'masks'),
('Тоники и сыворотки', 'serums');

-- Товары
INSERT INTO products (title, brand, price, short_desc, description, inci, usage_guide, volume, skin_types, category_id, stock, rating, reviews_count) VALUES
('Нежный очищающий гель', 'Some By Mi', 990, 'Мягко очищает кожу, не сушит, подходит для ежедневного использования.', 'Гель на основе центеллы и ниацинамида мягко очищает, успокаивает и увлажняет.', 'Aqua, Glycerin, Centella Asiatica Extract, Niacinamide...', 'Нанести на влажную кожу, помассировать, смыть водой.', '150 мл', ARRAY['all','sensitive'], 1, 50, 4.8, 1),
('Осветляющая сыворотка', 'Bielenda', 1250, 'Выравнивает тон кожи, дарит сияние и борется с пигментацией.', 'Сыворотка с 10% ниацинамида и витамином С осветляет пигментацию.', 'Niacinamide 10%, Vitamin C, Hyaluronic Acid...', 'Нанести несколько капель на очищенную кожу утром и вечером.', '30 мл', ARRAY['dry','combo'], 5, 30, 4.9, 0),
('Увлажняющий крем', 'Vitex', 890, 'Глубокое увлажнение на весь день, лёгкая текстура.', 'Крем с гиалуроновой кислотой и маслом ши интенсивно увлажняет и питает.', 'Hyaluronic Acid, Shea Butter, Vitamin E...', 'Наносить утром и вечером на лицо и шею.', '50 мл', ARRAY['dry','sensitive'], 1, 40, 4.7, 0),
('Пенка для умывания', 'Elizavecca', 750, 'Матирует, очищает поры, борется с воспалениями.', 'Пенка с чайным деревом и салициловой кислотой очищает поры.', 'Tea Tree Oil, Centella Asiatica, Salicylic Acid...', 'Нанести на влажную кожу, вспенить, смыть.', '120 мл', ARRAY['oily','combo'], 1, 60, 4.6, 0),
('Тоник с розовой водой', 'Missha', 680, 'Успокаивает, тонизирует, подготавливает кожу к уходу.', 'Тоник с розовой водой и ниацинамидом успокаивает и тонизирует кожу.', 'Rosa Damascena Flower Water, Niacinamide...', 'Нанести на ватный диск, протереть лицо.', '150 мл', ARRAY['all'], 5, 45, 4.8, 0),
('Крем для лица', 'Belkosmex', 820, 'Белорусская классика для сухой и чувствительной кожи.', 'Крем с пантенолом и витамином E увлажняет и восстанавливает сухую кожу.', 'Пантенол, витамин E, масло ши...', 'Наносить на лицо утром и вечером.', '50 мл', ARRAY['dry'], 1, 35, 4.5, 0),
('Сыворотка с гиалуронатом', 'Some By Mi', 1390, 'Максимальное увлажнение и восстановление барьера кожи.', 'Сыворотка с 5 типами гиалуроновой кислоты глубоко увлажняет кожу.', '5 типов Hyaluronic Acid, Centella...', 'Нанести после тоника, перед кремом.', '30 мл', ARRAY['all'], 5, 25, 4.9, 0),
('Шампунь для волос', 'Vitex', 490, 'Мягкий уход для всей семьи, без слёз.', 'Шампунь с экстрактом крапивы и ромашки мягко очищает волосы.', 'Экстракт крапивы, ромашки и пантенол...', 'Нанести на мокрые волосы, вспенить, смыть.', '400 мл', ARRAY['all'], 3, 70, 4.7, 0),
('Золотая маска', 'Elizavecca', 650, 'Интенсивное питание и сияние за 20 минут.', 'Маска с золотом и коллагеном питает и разглаживает кожу.', 'Коллаген, 24K Gold, гиалуроновая кислота...', 'Нанести на 20 минут, смыть.', '100 мл', ARRAY['sensitive'], 4, 55, 4.6, 0),
('Крем для рук', 'Bielenda', 420, 'Нежный уход за руками, быстро впитывается.', 'Крем с миндальным маслом увлажняет руки, не оставляет жирности.', 'Миндальное масло, пчелиный воск...', 'Наносить по мере необходимости.', '75 мл', ARRAY['all'], 2, 80, 4.8, 0),
('Мицеллярная вода', 'Missha', 580, 'Мягкое очищение макияжа без раздражения.', 'Мицеллярная вода с экстрактами трав очищает макияж.', 'Без спирта, с экстрактами трав...', 'Нанести на ватный диск, протереть лицо.', '200 мл', ARRAY['all'], 1, 65, 4.7, 0),
('Ночной крем с ретинолом', 'Vitex', 950, 'Восстановление кожи во время сна.', 'Ночной крем с ретинолом разглаживает морщины, увлажняет.', 'Ретинол, пептиды, масло ши...', 'Наносить вечером на очищенную кожу.', '50 мл', ARRAY['dry'], 1, 40, 4.6, 0);

-- Администратор (пароль: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Администратор', 'admin@kikicare.ru', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'admin');

-- Тестовый пользователь (пароль: user123)
INSERT INTO users (name, email, password, role) VALUES
('Тест Пользователь', 'user@kikicare.ru', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'user');