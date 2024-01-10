namespace Ocene.Models;

public class Student 
{
    [Key]
    public int ID { get; set; }

    public int Indeks { get; set; }

    [MaxLength(50)]
    public string? ImePrezime { get; set; }

}