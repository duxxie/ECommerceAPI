namespace Models.Carrinho;

public class Carrinho
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public Guid Usuario { get; set; }
}