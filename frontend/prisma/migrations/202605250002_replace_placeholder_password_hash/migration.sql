UPDATE "User"
SET "passwordHash" = '$2b$12$USBldblv81FOsasq0XcTP.4oNuaD0.OUilkLwKoXJ8tmWFk4qtbo.',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "username" = 'it'
  AND "passwordHash" = 'pending-seed-password';
