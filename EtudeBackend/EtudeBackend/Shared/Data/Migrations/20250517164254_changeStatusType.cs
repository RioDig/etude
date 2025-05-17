using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EtudeBackend.Shared.Data.Migrations
{
    /// <inheritdoc />
    public partial class changeStatusType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Price",
                table: "Courses",
                type: "text",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(10,2)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Courses",
                type: "numeric(10,2)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
