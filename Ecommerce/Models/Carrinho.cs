public class Carrinho
{
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public DateTime DataCriacao { get; set; } = DateTime.Now;
    public ICollection<ItemCarrinho> Itens { get; set; } = new List<ItemCarrinho>();
}