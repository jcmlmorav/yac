create table if not exists messages (
    id integer primary key autoincrement,
    user text null,
    message text not null
);

create table if not exists users (
    id integer primary key autoincrement,
    user text not null
);
