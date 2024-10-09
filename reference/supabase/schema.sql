create table AUTH_USER (
    auth_user_id bigint primary key generated always as identity,
    email text not null unique,
    password_hash text not null,
    name text,
    created_at timestamp with time zone not null default current_timestamp
);

-- Create USER table
create table app_user (
    user_id bigint primary key generated always as identity,
    auth_user_id bigint,
    name text not null,
    created_at timestamp with time zone not null,
    foreign key (auth_user_id) references AUTH_USER (auth_user_id)
);

-- Modify SESSION table
create table session (
    session_id bigint primary key generated always as identity,
    user_id bigint not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone,
    duration int,
    foreign key (user_id) references app_user (user_id)
);

-- Create new BOARD_USAGE table
create table BOARD_USAGE (
    board_usage_id bigint primary key generated always as identity,
    session_id bigint not null,
    board_type text not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone,
    duration int,
    foreign key (session_id) references session (session_id)
);

-- Create INTERACTION table
create table INTERACTION (
    interaction_id bigint primary key generated always as identity,
    session_id bigint not null,
    type text not null,
    content text,
    timestamp timestamp with time zone not null,
    composition_time int,
    foreign key (session_id) references session (session_id)
);

-- Create AUDIO_TRACE table
create table AUDIO_TRACE (
    audio_trace_id bigint primary key generated always as identity,
    interaction_id bigint not null,
    file_path text not null,
    timestamp timestamp with time zone not null,
    foreign key (interaction_id) references INTERACTION (interaction_id)
);

-- Create FEEDBACK table
create table FEEDBACK (
    feedback_id bigint primary key generated always as identity,
    user_id bigint not null,
    content text not null,
    timestamp timestamp with time zone not null,
    foreign key (user_id) references app_user (user_id)
);