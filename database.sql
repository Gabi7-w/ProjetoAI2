-- Base de dados PostgreSQL para a API de Gestao de Eventos
-- Compativel com os modelos Sequelize existentes no projeto.

DROP TABLE IF EXISTS "Registrations" CASCADE;
DROP TABLE IF EXISTS "Events" CASCADE;
DROP TABLE IF EXISTS "Categories" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;

CREATE TABLE "Users" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "role" VARCHAR(20) NOT NULL DEFAULT 'user',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Users_role_check" CHECK ("role" IN ('user', 'admin'))
);

CREATE TABLE "Categories" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Events" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT NOT NULL,
  "date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "location" VARCHAR(255) NOT NULL,
  "capacity" INTEGER,
  "creatorId" INTEGER REFERENCES "Users"("id") ON UPDATE CASCADE ON DELETE SET NULL,
  "categoryId" INTEGER REFERENCES "Categories"("id") ON UPDATE CASCADE ON DELETE SET NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Registrations" (
  "id" SERIAL PRIMARY KEY,
  "status" VARCHAR(20) NOT NULL DEFAULT 'active',
  "userId" INTEGER REFERENCES "Users"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  "eventId" INTEGER REFERENCES "Events"("id") ON UPDATE CASCADE ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Registrations_status_check" CHECK ("status" IN ('active', 'cancelled')),
  CONSTRAINT "Registrations_user_event_unique" UNIQUE ("userId", "eventId")
);

INSERT INTO "Users" ("id", "name", "email", "password", "role", "createdAt", "updatedAt") VALUES
  (1, 'Administrador', 'admin@eventos.pt', '$2b$10$dKnT8aDrsqZdWdWMLdk2wu0qrpGEebmxoxiXV38qIPRGi9xrp1o9a', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'Martim Silva', 'martim@email.com', '$2b$10$dKnT8aDrsqZdWdWMLdk2wu0qrpGEebmxoxiXV38qIPRGi9xrp1o9a', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'Ana Costa', 'ana@email.com', '$2b$10$dKnT8aDrsqZdWdWMLdk2wu0qrpGEebmxoxiXV38qIPRGi9xrp1o9a', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Categories" ("id", "name", "createdAt", "updatedAt") VALUES
  (1, 'Tecnologia', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'Desporto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'Cultura', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 'Educacao', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Events" ("id", "title", "description", "date", "location", "capacity", "creatorId", "categoryId", "createdAt", "updatedAt") VALUES
  (1, 'Workshop de React', 'Sessao pratica sobre componentes, hooks e consumo de APIs em React.', '2026-08-10 14:30:00+01', 'Viseu', 30, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'Torneio de Futsal', 'Torneio aberto a estudantes com fase de grupos e eliminatorias.', '2026-08-18 09:00:00+01', 'Pavilhao Municipal', 40, 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'Concerto Academico', 'Evento cultural com bandas locais e espaco de convivio.', '2026-09-05 21:00:00+01', 'Auditorio Municipal', 120, 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 'Seminario de Bases de Dados', 'Apresentacao sobre PostgreSQL, Sequelize e boas praticas de modelacao.', '2026-09-12 10:00:00+01', 'ESTGV', 50, 3, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Registrations" ("id", "status", "userId", "eventId", "createdAt", "updatedAt") VALUES
  (1, 'active', 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'active', 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'active', 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 'cancelled', 3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT setval('"Users_id_seq"', (SELECT MAX("id") FROM "Users"));
SELECT setval('"Categories_id_seq"', (SELECT MAX("id") FROM "Categories"));
SELECT setval('"Events_id_seq"', (SELECT MAX("id") FROM "Events"));
SELECT setval('"Registrations_id_seq"', (SELECT MAX("id") FROM "Registrations"));


