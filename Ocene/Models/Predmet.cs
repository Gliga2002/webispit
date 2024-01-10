namespace Ocene.Models;

public class Predmet
{
    [Key]
    public int ID { get; set; }

    [MaxLength(30)]
    public required string? Naziv { get; set; }

}