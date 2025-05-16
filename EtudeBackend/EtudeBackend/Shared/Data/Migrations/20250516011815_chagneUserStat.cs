using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EtudeBackend.Shared.Data.Migrations
{
    /// <inheritdoc />
    public partial class chagneUserStat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Link",
                table: "Courses",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Link",
                table: "Courses");
        }
    }
}
