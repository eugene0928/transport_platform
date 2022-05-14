-- branches
insert into branches(branch_name, branch_address) values
('Toshkent', 'Chilonzor'),
('Buxoro', 'Ark ko''chasi'),
('Jizzax', 'Muqumiy tumani');

-- staffs
insert into staffs(branch_id, staff_name, staff_password, staff_birth_date) values
(1, 'admin', 'admin', '2002-09-28'),
(1, 'Umidjon', 'umid111', '2002-09-28'),
(1, 'Hikmat', 'hikmat111', '2001-05-2'),
(2, 'Nosir', 'nosir111', '2002-01-28'),
(3, 'Mansur', 'mansur111', '2002-10-18');


-- transport permissions
--  for admin
insert into transport_per(staff_id, trans_create, trans_read, trans_delete, trans_update) values (1, true, true, true, true);
-- for others
insert into transport_per(staff_id) values
(2),
(3),
(4),
(5);

-- branches permissions
-- for admin
insert into branches_per(staff_id, branch_create, branch_read, branch_delete, branch_update) values (1, true, true, true, true);
-- for others
insert into branches_per(staff_id) values 
-- (1),
(2),
(3),
(4),
(5);

-- permissions permission :)
-- for admin
insert into permissions_per(staff_id, per_create, per_read, per_delete, per_update) values (1, true, true, true, true);
-- for others
insert into permissions_per(staff_id) values 
-- (1),
(2),
(3),
(4),
(5);

-- transports table
insert into transports(branch_id, staff_id, trans_model, trans_color, trans_img) values
(1, 1, 'audio', 'black', 'img/audio.jpg');