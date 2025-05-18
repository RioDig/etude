using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EtudeBackend.Shared.Data.Migrations
{
    /// <inheritdoc />
    public partial class changeStatusTypy4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_UserBasicDto_LearnerId",
                table: "Courses");

            migrationBuilder.DropTable(
                name: "UserBasicDto");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_AspNetUsers_LearnerId",
                table: "Courses",
                column: "LearnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_AspNetUsers_LearnerId",
                table: "Courses");

            migrationBuilder.CreateTable(
                name: "UserBasicDto",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Department = table.Column<string>(type: "text", nullable: false),
                    IsLeader = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Patronymic = table.Column<string>(type: "text", nullable: true),
                    Position = table.Column<string>(type: "text", nullable: false),
                    Surname = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBasicDto", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_UserBasicDto_LearnerId",
                table: "Courses",
                column: "LearnerId",
                principalTable: "UserBasicDto",
                principalColumn: "Id");
        }
    }
}
