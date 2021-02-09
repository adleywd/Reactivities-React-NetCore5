using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        // Need to add the DbSet to migration know which it should map
        // To run migrations in the root folder type:
        // $ dotnet ef migrations add "NameOfNewMagrition" -p Persistence -s API
        // p|--project : The project to use. Defaults to the current working directory.
        // -s|--startup-project : The startup project to use. Defaults to the current working directory.

        public DbSet<Value> Values { get; set; }
        public DbSet<Activity> Activities { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Value>()
                .HasData(
                    new Value { Id = 1, Name = "Value 101" },
                    new Value { Id = 2, Name = "Value 102" },
                    new Value { Id = 3, Name = "Value 103" }
                );
        }
    }
}