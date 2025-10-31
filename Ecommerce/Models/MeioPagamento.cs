namespace Ecommerce.Models;

public class MeioPagamento
{
    public int Id { get; set; }
    public string Tipo { get; set; } = string.Empty; // Ex: "Cartão", "Pix", "Boleto"
}
