using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EtudeBackend.Shared.Data.Migrations
{
    /// <inheritdoc />
    public partial class changeCourseTemplates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "EndDate",
                table: "CourseTemplates",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<string>(
                name: "Link",
                table: "CourseTemplates",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateOnly>(
                name: "StartDate",
                table: "CourseTemplates",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.CreateIndex(
                name: "IX_CourseTemplates_EndDate",
                table: "CourseTemplates",
                column: "EndDate");

            migrationBuilder.CreateIndex(
                name: "IX_CourseTemplates_StartDate",
                table: "CourseTemplates",
                column: "StartDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CourseTemplates_EndDate",
                table: "CourseTemplates");

            migrationBuilder.DropIndex(
                name: "IX_CourseTemplates_StartDate",
                table: "CourseTemplates");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "CourseTemplates");

            migrationBuilder.DropColumn(
                name: "Link",
                table: "CourseTemplates");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "CourseTemplates");
        }
    }
}
