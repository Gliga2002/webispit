using Ocene.Classes;

namespace WebTemplate.Controllers;

[ApiController]
[Route("[controller]")]
public class OceneController : ControllerBase
{
    public OceneContext Context { get; set; }

    public OceneController(OceneContext context)
    {
        Context = context;
    }

    [HttpPost("DodajStudenta")]
    public async Task<ActionResult> DodajStudenta ([FromBody] Student student)
    {
        try 
        {
            await Context.Studenti.AddAsync(student);
            await Context.SaveChangesAsync();
            return Ok($"Dodat student sa ID: {student.ID}");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("PreuzmiStudente")]
    public async Task<ActionResult> PreuzmiStudente() 
    {
        try
        {
            var studenti = await Context.Studenti.ToListAsync();
            return Ok(studenti);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("PreuzmiStudenta/{studentID}")]
    public async Task<ActionResult> PreuzmiStudenta(int studentID) 
    {
        try
        {
            var student = await Context.Studenti.FindAsync(studentID);
            if (student != null) return Ok(student);
            else return NotFound($"Student sa ID-jem {studentID} ne postoji.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [HttpPost("DodajPredmet")]
    public async Task<ActionResult> DodajPredmet ([FromBody] Predmet predmet)
    {
        try 
        {
            await Context.Predmeti.AddAsync(predmet);
            await Context.SaveChangesAsync();
            return Ok($"Dodat predmet sa ID: {predmet.ID}");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("PreuzmiPredmete")]
    public async Task<ActionResult> PreuzmiPredmete() 
    {
        try
        {
            var predmeti = await Context.Predmeti.ToListAsync();
            return Ok(predmeti);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("DodajOcenu")]
    public async Task<ActionResult> DodajOcenu([FromBody] OcenaDto ocena) 
    {
        try
        {
            // dodati studenta
            Student? student = await Context.Studenti.Where(s => s.Indeks == ocena.BrojIndeksa).FirstOrDefaultAsync();
            if (student == null) 
            {
                student = new Student{
                    ImePrezime = ocena.ImePrezime,
                    Indeks = ocena.BrojIndeksa
                };
                await Context.Studenti.AddAsync(student);
            }
            // dodati predmet
            Predmet? predmet = await Context.Predmeti.Where(p => p.Naziv == ocena.Predmet).FirstOrDefaultAsync();
            Console.WriteLine(predmet);
            if (predmet == null)
            {
                predmet = new Predmet{
                    Naziv = ocena.Predmet
                };
                await Context.Predmeti.AddAsync(predmet);
            }
            // dodati ocenu
            Ocena novaOcena = new Ocena{
                Vrednost = ocena.Ocena,
                Predmet = predmet,
                Student = student
            };
            await Context.Ocene.AddAsync(novaOcena);
            await Context.SaveChangesAsync();
            return Ok(novaOcena);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
        
    }

    [HttpPut("PreuzmiOcene")]
    public async Task<ActionResult> PreuzmiOcene([FromBody] int[] predmetIDs) 
    {
        try
        {
            var ocene = await Context.Ocene.Include(ocena => ocena.Predmet)
                            .Where(ocena => predmetIDs.Contains(ocena.Predmet!.ID))
                            .Include(ocena => ocena.Student)
                            .ToListAsync();
            return Ok(ocene);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

}