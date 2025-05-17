using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EtudeBackend.Shared.Data.Migrations
{
    /// <inheritdoc />
    public partial class changeStatusTypy1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Statuses",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Processed");

            migrationBuilder.CreateIndex(
                name: "IX_Statuses_Type",
                table: "Statuses",
                column: "Type");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Statuses_Type",
                table: "Statuses");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Statuses");
        }
    }
}
