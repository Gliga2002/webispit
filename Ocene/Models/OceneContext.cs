namespace Ocene.Models;

public class OceneContext : DbContext 
{

    public DbSet<Student> Studenti { get; set; }
    public DbSet<Predmet> Predmeti { get; set; }
    public DbSet<Ocena> Ocene { get; set; }

    public OceneContext(DbContextOptions options) : base(options)
    {
        
    }
}