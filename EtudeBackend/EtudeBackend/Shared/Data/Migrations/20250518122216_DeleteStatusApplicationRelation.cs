using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EtudeBackend.Shared.Data.Migrations
{
    /// <inheritdoc />
    public partial class DeleteStatusApplicationRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_Statuses_StatusId",
                table: "Applications");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_Statuses_StatusId",
                table: "Applications",
                column: "StatusId",
                principalTable: "Statuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_Statuses_StatusId",
                table: "Applications");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_Statuses_StatusId",
                table: "Applications",
                column: "StatusId",
                principalTable: "Statuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
