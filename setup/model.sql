-- create database
drop database if exists transport_crm;
create database if not exists transport_crm;

\c transport_crm

-- create table branches
drop table if exists branches;
create table if not exists branches(
    branch_id int generated always as identity primary key,
    branch_name varchar(128) not null,
    branch_address varchar(128) not null,
    branch_created_at timestamptz default current_timestamp
);

-- staffs table
drop table if exists staffs;
create table if not exists staffs(
    staff_id int generated always as identity primary key,
    branch_id int not null references branches(branch_id),
    staff_name varchar(128) not null,
    staff_password varchar(128) not null,
    staff_birth_date date check(staff_birth_date > '1960-01-01' and staff_birth_date < '2017-01-01'),
    staff_gender int2 default 1,
    staff_created_at timestamptz default current_timestamp
);

-- transports permissions
drop table if exists transport_per;
create table if not exists transport_per(
    trans_permission_id int generated always as identity primary key,
    staff_id int references staffs(staff_id),
    trans_create boolean default false,
    trans_read boolean default false,
    trans_delete boolean default false,
    trans_update boolean default false,
    trans_permission_created_at timestamptz default current_timestamp
);

-- branches permissions
drop table if exists branches_per;
create table if not exists branches_per(
    branch_permission_id int generated always as identity primary key,
    staff_id int references staffs(staff_id),
    branch_create boolean default false,
    branch_read boolean default false,
    branch_delete boolean default false,
    branch_update boolean default false,
    branch_permission_created_at timestamptz default current_timestamp
);

-- permissions permission :)
drop table if exists permissions_per;
create table if not exists permissions_per(
    per_permission_id int generated always as identity primary key,
    staff_id int references staffs(staff_id),
    per_create boolean default true,
    per_read boolean default true,
    per_delete boolean default true,
    per_update boolean default true,
    per_permission_created_at timestamptz default current_timestamp
);


-- transports table
drop table if exists transports;
create table if not exists transports(
    trans_id int generated always as identity primary key,
    branch_id int not null references branches(branch_id),
    staff_id int not null references staffs(staff_id), 
    trans_model varchar(255) not null,
    trans_color varchar(20) not null,
    trans_img varchar(255) not null,
    trans_created_at timestamptz default current_timestamp
);


