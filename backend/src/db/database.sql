CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE skiresort;

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL,
    user_email TEXT UNIQUE NOT NULL,
    user_password TEXT NOT NULL,
    user_role TEXT DEFAULT 'user' CHECK (user_role IN ('user', 'instructor', 'admin')),
    --user_image_url TEXT DEFAULT "some picture online",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE rooms (
    room_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number VARCHAR(10) UNIQUE NOT NULL,
    capacity INTEGER DEFAULT 2,
    price_per_night DECIMAL(10,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);


CREATE TABLE equipment (
    equipment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_type TEXT NOT NULL CHECK (equipment_type IN ('skis', 'snowboard', 'boots', 'helmet')),
    size VARCHAR(10) NOT NULL, -- '42', 'M', 'L', etc.
    brand TEXT,
    model TEXT,
    price_per_day DECIMAL(10,2) NOT NULL,
    available_quantity INTEGER NOT NULL DEFAULT 10,
    total_quantity INTEGER NOT NULL DEFAULT 10,
    is_active BOOLEAN DEFAULT true
);


CREATE TABLE instructors (
    instructor_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    bio TEXT,
    experience_years INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10,2) NOT NULL,
    profile_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id) 
);


CREATE TABLE room_reservations (
    reservation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests_count INTEGER DEFAULT 1 CHECK (guests_count <= 2),
    total_nights INTEGER GENERATED ALWAYS AS (check_out_date - check_in_date) STORED,
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
);


CREATE TABLE equipment_reservations (
    reservation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    equipment_id UUID NOT NULL REFERENCES equipment(equipment_id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_days INTEGER GENERATED ALWAYS AS (end_date - start_date + 1) STORED,
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (end_date >= start_date),
    CONSTRAINT valid_quantity CHECK (quantity > 0 AND quantity <= 10)
);

CREATE TABLE instructor_reservations (
    reservation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES instructors(instructor_id) ON DELETE CASCADE,
    lesson_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours INTEGER GENERATED ALWAYS AS (EXTRACT(hour FROM (end_time - start_time))) STORED,
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    lesson_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_time CHECK (end_time > start_time),
    CONSTRAINT valid_duration CHECK (EXTRACT(hour FROM (end_time - start_time)) <= 3)
);


CREATE TABLE messages (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_reservation_id UUID NOT NULL REFERENCES instructor_reservations(reservation_id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT message_not_empty CHECK (LENGTH(TRIM(message_text)) > 0)
);


CREATE TABLE instructor_availability (
    availability_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID NOT NULL REFERENCES instructors(instructor_id) ON DELETE CASCADE,
    available_date DATE NOT NULL,
    start_time TIME DEFAULT '06:00:00',
    end_time TIME DEFAULT '16:00:00',
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(instructor_id, available_date)
);