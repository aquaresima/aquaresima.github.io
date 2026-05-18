Title: Computational Neuroscience Course
page_order: 99
status: hidden

← [Back to Teaching](pages/teaching.html)

## Computational Neuroscience — M2 Biomedical Engineering, Paris Cité University

An M2 course covering biophysical neuron models and spiking network simulations. Students with mixed backgrounds (biology, medicine, biotechnology) used the [JuliaSNN](https://juliasnn.github.io/SpikingNeuralNetworks.jl) simulation library to reproduce results from research papers in computational neuroscience.

### CompNeuro.jl

I wrote [CompNeuro.jl](https://github.com/JuliaSNN/CompNeuro.jl) for the course. It provides interactive visualizations of 2D biophysical neuron models, allowing students to explore model dynamics by varying parameters in real time.

**Neuron models included:**

- AdEx (Adaptive Exponential Integrate-and-Fire)
- FitzHugh–Nagumo
- Morris–Lecar
- Any 2D model can be added

**Synapse types:**

- Conductance-based synapses
- Current-based synapses

<video controls autoplay id="AdEx model" class="video-js vjs-default-skin"
preload="auto" width="600" height="800" poster="https://raw.githubusercontent.com/JuliaSNN/CompNeuro.jl/refs/heads/main/assets/adex_example.png"
data-setup="{}">
<source src="../images/adex.mp4" type='video/mp4'>
</video>
