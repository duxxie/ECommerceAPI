namespace Ecommerce.Models;

public class Pedido
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public DateTime DataPedido { get; set; } = DateTime.Now;
    public string Status { get; set; } = "Em andamento";

    // Relacionamentos
    public Usuario? Usuario { get; set; }
    public ICollection<ItemPedido>? Itens { get; set; }
    public Fatura? Fatura { get; set; }
}
