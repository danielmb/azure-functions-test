BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Name] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstName] NVARCHAR(1000) NOT NULL,
    [middleName] NVARCHAR(1000),
    [lastName] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Name_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Address] (
    [id] INT NOT NULL IDENTITY(1,1),
    [street] NVARCHAR(1000) NOT NULL,
    [city] NVARCHAR(1000) NOT NULL,
    [zip] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Address_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Post] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(1000) NOT NULL,
    [body] NVARCHAR(1000) NOT NULL,
    [creatorId] INT NOT NULL,
    CONSTRAINT [Post_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nameId] INT NOT NULL,
    [addressId] INT,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Post] ADD CONSTRAINT [Post_creatorId_fkey] FOREIGN KEY ([creatorId]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Users] ADD CONSTRAINT [Users_nameId_fkey] FOREIGN KEY ([nameId]) REFERENCES [dbo].[Name]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Users] ADD CONSTRAINT [Users_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
