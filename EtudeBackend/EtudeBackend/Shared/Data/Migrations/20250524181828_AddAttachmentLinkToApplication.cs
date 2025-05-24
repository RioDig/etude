using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EtudeBackend.Shared.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAttachmentLinkToApplication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AttachmentLink",
                table: "Applications",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AttachmentLink",
                table: "Applications");
        }
    }
}
