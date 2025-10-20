using Models.Pedido;

public class Usuario
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
    public string Email { get; set; } = "";
    public string Endereco { get; set; } = "";

    public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
    public Carrinho? Carrinho { get; set; }
}