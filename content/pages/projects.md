Title: Research Projects 
Date: 2020-01-01
Modified: 2023-12-23
page_order: 1
save_as: index.html
URL:..

My research develops biophysically grounded models of cortical circuits to understand how neurons and networks implement computation. The work spans three interconnected themes: dendritic integration and nonlinear single-cell dynamics, synaptic plasticity and memory formation, and the functional specialization of cortical cell types — with a particular focus on auditory cortex and spoken language.

All projects rely on close interaction with experimental data, and I actively seek collaborations with groups doing electrophysiology, calcium imaging, or optogenetics. Please get in touch if you are interested in working together.

## Neuronal and Network Mechanisms of Auditory Working Memory
Computational and experimental studies indicate that auditory working memory lies in the coordination of cortical network dynamics and single-cell physiological properties. However, how these mechanisms for memory interact during the encoding, maintaining, and retrieving of cued memories remains largely unknown.
The project, supported by the Pasteur-Roux-Cantarini fellowship, aims to establish the role of cellular- and network-level processes in maintaining short-term memories. The investigation is carried out by studying [biophysical network models](https://juliasnn.github.io/SpikingNeuralNetworks.jl) and comparing it with [calcium and voltage imaging recordings](https://doi.org/10.1016/j.neuron.2019.09.043).

![alt text](../images/abstract_working_memory.jpg "Auditory WM")
Figure 1: (A) Four simplified WM models will be compared during the project. (B) The set of biological constraints of cortical circuitry which implemented in the biophysical network.

## Spectrotemporal Transformations in the Auditory Cortex
In mice, the auditory cortex is necessary to process complex sound patterns and transform subcortical temporal codes into flexible [cortical population codes](https://www.science.org/doi/10.1126/sciadv.adr6214). The challenge for the auditory cortex is to integrate information over time to activate the correct neuronal representations. Previous work has shown [the network properties that support this computation](https://elifesciences.org/articles/53151).

The auditory cortex also shows robust onset and offset responses, bursts of activity that follow sound initiation and termination. For complex sounds, the stimulus identity remains linearly decodable from the offset response after the sound has ended. Which circuit elements build this response is unknown: several candidate mechanisms explain offset bursts equally well, and they are hard to tell apart when they are not tested against other properties of cortical dynamics.

I address this question by constraining biophysical spiking networks to the functions and statistics of the auditory cortex at the same time. Each network models pyramidal cells with PV and SST interneurons, and is driven by spike trains recorded in the medial geniculate body of mice during passive listening to 88 sounds. A multi-objective Pareto optimiser (MOTPE) searches 37 free parameters against six objectives that span firing statistics, response timing, sound decoding, and representational similarity with cortical recordings. No parameter set satisfies all objectives equally well, and the solutions spread along a Pareto front. I segmented them into three regimes with orthogonal performance. The main trade-off is between networks with high decoding capacity and networks with low-firing, temporally stable representations. Strong, adapting thalamic input in feedforward-dominated networks best accounts for an information-rich offset response, while recurrent connectivity is necessary to integrate this information into time-stable representations. I hypothesize that, in the auditory cortex, heterogeneity at the cellular and synaptic scale reconciles these two functional requirements.

![alt text](../images/abstract_spectrotemporal_ac.png "Data-optimized auditory cortex networks")
Figure 1: (a) Pure tones, amplitude-modulated (AM) and frequency-modulated (FM) sounds are presented at three intensities. (b) Biophysical network with tonotopic thalamic projections and recurrent connectivity among pyramidal cells, PV and SST interneurons; spikes are convolved with a calcium filter to compare with imaging data. (c) Electrophysiology and calcium imaging recordings provide the experimental constraints. (d) A Bayesian MOTPE optimiser updates the parameters to satisfy six objectives: onset-offset similarity, sound recognition, model-data representational similarity, sound response, firing irregularity, and firing rate distribution.

## Performant Spiking Neural Network Simulator in Julia
[JuliaSNN](https://juliasnn.github.io/SpikingNeuralNetworks.jl) is a library for simulation of biophysical network models. The library offers:
i. Modular, flexible, and quick instantiation of complex biophysical models;
ii. Rich model library and easy implementation of custom new models;
iii. High performance and native multi-threading support, laptop and cluster-friendly;
iv. Easy access to models' variables and parameters and save-load-rerun of arbitrarily complex networks.
SpikingNeuralNetworks.jl is defined within the JuliaSNN ecosystem, which offers SNNPlots to plot models' recordings and SNNUtils for further stimulation protocols and analysis.

## Dendritic Integration and Hetero-Associative Memories
In a recent work, we showed the capacity of biological networks to detect sequences of brief, transitory stimuli thanks to cellular properties ([Dendrites support formation and reactivation of sequential memories through Hebbian plasticity 2023](https://www.biorxiv.org/content/10.1101/2023.09.26.559322v2.full.pdf+html)). The computational study demonstrates the formation of hetero-associative memories, in the form of asymmetric synaptic engrams, between low-level and high-level cell assemblies. The synaptic structure is necessary and sufficient for the word assemblies to activate upon the presentation of the correct sequence of low-level features.

![alt text](../images/abstract_tripod_network.jpg "Dendritic integration model")
Figure 1: (A) Tripod network with its connectivity patterns, receptor timescales, and membrane dynamics. (B) Word and phonemes target overlapping assemblies. (C) Word-recognition score of networks with point neurons and Tripod neurons. (D) Performance loss after modulation of dendritic non-linearity and iSTDP.

## Dendrites Support Temporal Computations and Account for Physiological States
My Ph.D. research focused on the dynamics of neuronal models that include reduced dendritic compartments.
We have shown that such models:  <br>
i. [Have richer computational capacities](https://physoc.onlinelibrary.wiley.com/doi/full/10.1113/JP283399), among which the ability to carry a trace of the inputs' temporal structure over hundreds of milliseconds.<br>
ii. Exhibit membrane bistability in response to small fluctuations in the input, coordinating [network and cellular levels Up-Down states](https://www.biorxiv.org/content/10.1101/2024.09.05.611249v3)