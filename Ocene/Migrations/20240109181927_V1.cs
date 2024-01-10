using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ocene.Migrations
{
    /// <inheritdoc />
    public partial class V1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Predmeti",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Predmeti", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Studenti",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Indeks = table.Column<int>(type: "int", nullable: false),
                    ImePrezime = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Studenti", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Ocene",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Vrednost = table.Column<int>(type: "int", nullable: false),
                    StudentFK = table.Column<int>(type: "int", nullable: true),
                    PredmetFK = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ocene", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Ocene_Predmeti_PredmetFK",
                        column: x => x.PredmetFK,
                        principalTable: "Predmeti",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_Ocene_Studenti_StudentFK",
                        column: x => x.StudentFK,
                        principalTable: "Studenti",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ocene_PredmetFK",
                table: "Ocene",
                column: "PredmetFK");

            migrationBuilder.CreateIndex(
                name: "IX_Ocene_StudentFK",
                table: "Ocene",
                column: "StudentFK");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ocene");

            migrationBuilder.DropTable(
                name: "Predmeti");

            migrationBuilder.DropTable(
                name: "Studenti");
        }
    }
}
