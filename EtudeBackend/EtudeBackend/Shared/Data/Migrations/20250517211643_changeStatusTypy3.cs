using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EtudeBackend.Shared.Data.Migrations
{
    /// <inheritdoc />
    public partial class changeStatusTypy3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LearnerId",
                table: "Courses",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UserBasicDto",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Surname = table.Column<string>(type: "text", nullable: false),
                    Patronymic = table.Column<string>(type: "text", nullable: true),
                    Position = table.Column<string>(type: "text", nullable: false),
                    Department = table.Column<string>(type: "text", nullable: false),
                    IsLeader = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBasicDto", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Courses_LearnerId",
                table: "Courses",
                column: "LearnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_UserBasicDto_LearnerId",
                table: "Courses",
                column: "LearnerId",
                principalTable: "UserBasicDto",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_UserBasicDto_LearnerId",
                table: "Courses");

            migrationBuilder.DropTable(
                name: "UserBasicDto");

            migrationBuilder.DropIndex(
                name: "IX_Courses_LearnerId",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "LearnerId",
                table: "Courses");
        }
    }
}
