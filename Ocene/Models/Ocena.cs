namespace Ocene.Models;

public class Ocena
{
    [Key]
    public int ID { get; set; }

    public required int Vrednost { get; set; }

    [ForeignKey("StudentFK")]
    public Student? Student { get; set; }

    [ForeignKey("PredmetFK")]
    public Predmet? Predmet { get; set; }
}