import bcrypt from 'bcryptjs';

const password = 'Admin123!';

const hash = await bcrypt.hash(password, 10);

console.log(hash);

/* 

INSERT INTO usuarios (
    nombre,
    correo,
    password_hash,
    role,
    es_activo
)
VALUES (
    'Administrador',
    'admin@triunfabeca.com',
    '$2a$10$q59yPN1AduHKtDdNFshoSezLRz3EuCryhRCetieakrtRuwa2UpkIG',
    'ADMIN',
    true
);


*/